const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
        required: true
    },
    proficiency: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['To Learn', 'Learning', 'Mastered'],
        default: 'To Learn'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique skill per user
userSkillSchema.index({ user: 1, skill: 1 }, { unique: true });

module.exports = mongoose.model('UserSkill', userSkillSchema);
