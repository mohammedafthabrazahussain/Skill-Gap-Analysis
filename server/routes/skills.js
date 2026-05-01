const express = require('express');
const { getSkills, createSkill, updateUserSkill, getUserSkills } = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getSkills)
    .post(protect, authorize('admin'), createSkill);

router.route('/user')
    .get(protect, getUserSkills)
    .put(protect, updateUserSkill);

module.exports = router;
