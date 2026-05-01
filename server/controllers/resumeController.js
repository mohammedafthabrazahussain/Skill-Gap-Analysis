const pdf = require('pdf-parse');
const Skill = require('../models/Skill');

exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        console.log('File received:', req.file.originalname);
        const dataBuffer = req.file.buffer;
        const data = await pdf(dataBuffer);
        const text = data.text.toLowerCase();
        console.log('PDF text extracted length:', text.length);

        // Get all skills from DB to match
        const skills = await Skill.find();
        const detectedSkills = [];

        skills.forEach(skill => {
            const skillName = skill.name.toLowerCase();
            // Match exact word or common variations (e.g., react.js matches reactjs)
            const cleanSkillName = skillName.replace(/[^a-z0-9]/g, '');
            const cleanText = text.replace(/[^a-z0-9]/g, '');
            
            if (cleanText.includes(cleanSkillName)) {
                detectedSkills.push(skill);
            }
        });

        res.status(200).json({
            success: true,
            count: detectedSkills.length,
            data: detectedSkills
        });
    } catch (err) {
        console.error('Resume Analysis Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};
