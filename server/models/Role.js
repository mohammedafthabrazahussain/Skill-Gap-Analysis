const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a role title'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    requiredSkills: [{
        skill: {
            type: mongoose.Schema.ObjectId,
            ref: 'Skill',
            required: true
        },
        levelRequired: {
            type: Number,
            default: 70 // 0-100 proficiency
        }
    }],
    industryImpact: {
        demand: { type: String, enum: ['Extreme', 'Critical', 'Very High', 'High', 'Medium', 'Low'], default: 'High' },
        avgSalary: { type: String },
        relevanceScore: { type: Number, min: 0, max: 100, default: 85 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', roleSchema);
