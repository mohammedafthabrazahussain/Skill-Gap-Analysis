const express = require('express');
const multer = require('multer');
const { analyzeResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, (req, res, next) => {
    console.log('POST /api/v1/resume/upload - Request Received');
    console.log('User ID:', req.user ? req.user.id : 'No user found');
    next();
}, upload.single('resume'), analyzeResume);

module.exports = router;
