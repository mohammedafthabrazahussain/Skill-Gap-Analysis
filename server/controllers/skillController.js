const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');

exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json({ success: true, data: skills });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createSkill = async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json({ success: true, data: skill });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateUserSkill = async (req, res) => {
    try {
        const { skillId, proficiency, status } = req.body;
        
        let userSkill = await UserSkill.findOne({ user: req.user._id, skill: skillId });

        if (userSkill) {
            userSkill.proficiency = proficiency;
            userSkill.status = status;
            userSkill.lastUpdated = Date.now();
            await userSkill.save();
        } else {
            userSkill = await UserSkill.create({
                user: req.user._id,
                skill: skillId,
                proficiency,
                status
            });
        }

        res.status(200).json({ success: true, data: userSkill });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUserSkills = async (req, res) => {
    try {
        const userSkills = await UserSkill.find({ user: req.user.id }).populate('skill');
        res.status(200).json({ success: true, data: userSkills });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
