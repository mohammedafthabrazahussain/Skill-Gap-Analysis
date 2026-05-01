const Role = require('../models/Role');
const Skill = require('../models/Skill');

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('requiredSkills.skill');
        res.status(200).json({ success: true, data: roles });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('requiredSkills.skill');
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.status(200).json({ success: true, data: role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, data: role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
