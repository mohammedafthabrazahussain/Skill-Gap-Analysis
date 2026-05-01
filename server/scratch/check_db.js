const mongoose = require('mongoose');
const Role = require('../models/Role');
const Skill = require('../models/Skill');
const dotenv = require('dotenv');
dotenv.config();

const checkData = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const roles = await Role.find().populate('requiredSkills.skill');
    console.log('Roles found:', roles.length);
    roles.forEach(r => {
        console.log(`Role: ${r.title}, Skills: ${r.requiredSkills.length}`);
        r.requiredSkills.forEach(rs => {
            console.log(`  - Skill: ${rs.skill ? rs.skill.name : 'NULL'}`);
        });
    });
    process.exit();
};

checkData();
