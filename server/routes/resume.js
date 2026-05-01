const express = require('express');
const multer = require('multer');
const { analyzeResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
    '/upload',
    protect,
    upload.single('resume'),
    analyzeResume
);

// Debug (optional)
console.log("Resume router loaded");

module.exports = router;