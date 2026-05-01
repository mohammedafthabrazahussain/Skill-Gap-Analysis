const User = require('../models/User');
const Role = require('../models/Role');
const UserSkill = require('../models/UserSkill');
const Resource = require('../models/Resource');
const UserResource = require('../models/UserResource');

exports.analyzeGap = async (req, res) => {
    try {
        const { roleId } = req.body;
        const userId = req.user.id;
        console.log(`Analyzing gap for User: ${userId}, Role: ${roleId}`);

        const role = await Role.findById(roleId).populate('requiredSkills.skill');
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        // Update user's target role and add to collection
        console.log(`Searching for User ID: ${userId} to update portfolio...`);
        const user = await User.findById(userId);
        if (user) {
            console.log(`User found: ${user.name}. Current targetRoles length: ${user.targetRoles?.length || 0}`);
            user.targetRole = roleId;

            // Ensure targetRoles array exists
            if (!user.targetRoles) user.targetRoles = [];

            // Use .some() with toString() for reliable ObjectId comparison
            const alreadyHasRole = user.targetRoles.some(r => r && r.toString() === roleId.toString());

            if (!alreadyHasRole) {
                user.targetRoles.push(roleId);
                console.log(`Successfully added Role ${roleId} to user portfolio. New length: ${user.targetRoles.length}`);
            } else {
                console.log(`Role ${roleId} already in portfolio. Skipping.`);
            }

            await user.save();
            console.log(`User saved successfully.`);
        } else {
            console.warn(`User ${userId} NOT FOUND during portfolio update!`);
        }

        // Get user's current skills
        const userSkills = await UserSkill.find({ user: userId });
        const userSkillsMap = new Map(userSkills.map(us => [us.skill.toString(), us]));

        let totalRequiredScore = 0;
        let totalUserScore = 0;
        const gaps = [];
        const completed = [];

        role.requiredSkills.forEach(rs => {
            if (!rs.skill) return; // Skip if skill data is missing
            const skillId = rs.skill._id.toString();
            const requiredLevel = rs.levelRequired;
            const userSkill = userSkillsMap.get(skillId);
            const userLevel = userSkill ? userSkill.proficiency : 0;

            totalRequiredScore += requiredLevel;
            // Cap user level at required level for readiness calculation
            totalUserScore += Math.min(userLevel, requiredLevel);

            if (userLevel < requiredLevel) {
                gaps.push({
                    skill: rs.skill,
                    requiredLevel,
                    userLevel,
                    gap: requiredLevel - userLevel,
                    status: userSkill ? userSkill.status : 'To Learn'
                });
            } else {
                completed.push({
                    skill: rs.skill,
                    userLevel
                });
            }
        });

        const readinessScore = totalRequiredScore > 0 ? (totalUserScore / totalRequiredScore) * 100 : 0;

        // Recommendations: Top 3 gaps with high importance
        const recommendations = gaps
            .sort((a, b) => {
                const importanceOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return importanceOrder[b.skill.importance] - importanceOrder[a.skill.importance];
            })
            .slice(0, 3);

        res.status(200).json({
            success: true,
            data: {
                readinessScore: Math.round(readinessScore),
                totalSkills: role.requiredSkills.length,
                completedSkillsCount: completed.length,
                missingSkillsCount: gaps.length,
                gaps,
                completed,
                recommendations
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.toggleResource = async (req, res) => {
    try {
        const { resourceId } = req.body;
        const userId = req.user._id;

        // Toggle completion
        let completion = await UserResource.findOne({ user: userId, resource: resourceId });
        if (completion) {
            await UserResource.findByIdAndDelete(completion._id);
        } else {
            await UserResource.create({ user: userId, resource: resourceId });
        }

        // Get resource details to find associated skill
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            console.error('Resource not found:', resourceId);
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        const skillId = resource.skill;
        console.log(`Toggling resource for skill: ${skillId}`);

        // Calculate new proficiency for this skill
        const totalResources = await Resource.countDocuments({ skill: skillId });
        const completedCount = await UserResource.countDocuments({
            user: userId,
            resource: { $in: await Resource.distinct('_id', { skill: skillId }) }
        });

        const newProficiency = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

        // Update UserSkill
        await UserSkill.findOneAndUpdate(
            { user: userId, skill: skillId },
            {
                proficiency: newProficiency,
                status: newProficiency >= 90 ? 'Mastered' : newProficiency > 0 ? 'Learning' : 'To Learn',
                lastUpdated: Date.now()
            },
            { upsert: true }
        );

        // Update Streak
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const today = new Date().setHours(0, 0, 0, 0);
        const lastActive = user.streak?.lastActive ? new Date(user.streak.lastActive).setHours(0, 0, 0, 0) : 0;
        const diff = (today - lastActive) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
            user.streak.current += 1;
        } else if (diff > 1) {
            user.streak.current = 1;
        }

        user.streak.lastActive = Date.now();
        if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
        }
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                proficiency: newProficiency,
                streak: user.streak.current
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getLearningPath = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.user.id;

        const resources = await Resource.find({ skill: skillId }).sort({ level: 1 });
        const completions = await UserResource.find({ user: userId });
        const completedIds = new Set(completions.map(c => c.resource.toString()));

        const enrichedResources = resources.map(res => ({
            ...res.toObject(),
            completed: completedIds.has(res._id.toString())
        }));

        res.status(200).json({
            success: true,
            data: enrichedResources
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
