const mongoose = require('mongoose');

const userResourceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    resource: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource',
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only mark a resource as completed once
userResourceSchema.index({ user: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model('UserResource', userResourceSchema);
