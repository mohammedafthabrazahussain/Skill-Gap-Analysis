const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a skill name'],
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Frontend', 'Backend', 'DevOps', 'Design', 'Mobile', 'Data Science', 'AI', 'Cybersecurity', 'Database', 'API', 'General', 'Cloud', 'Soft Skills', 'Other']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    importance: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    estimatedHours: {
        type: Number,
        default: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Skill', skillSchema);
