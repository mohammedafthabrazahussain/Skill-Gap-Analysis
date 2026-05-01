const express = require('express');
const { getRoles, getRole, createRole } = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getRoles)
    .post(protect, authorize('admin'), createRole);

router.route('/:id')
    .get(getRole);

module.exports = router;
