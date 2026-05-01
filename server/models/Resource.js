const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Video', 'Article', 'Course', 'Documentation'],
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Project'],
        required: true
    },
    duration: {
        type: String, // e.g., "2 hours", "4 weeks"
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', resourceSchema);
