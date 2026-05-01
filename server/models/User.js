const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    targetRole: {
        type: mongoose.Schema.ObjectId,
        ref: 'Role'
    },
    targetRoles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Role'
    }],
    dob: Date,
    mobile: String,
    socials: {
        linkedin: String,
        github: String,
        portfolio: String,
        twitter: String
    },
    skills: [String],
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    projects: [{
        title: String,
        description: String,
        link: String,
        technologies: [String]
    }],
    streak: {
        current: { type: Number, default: 0 },
        lastActive: { type: Date, default: Date.now },
        longest: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed.');
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
