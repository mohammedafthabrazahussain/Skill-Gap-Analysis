const express = require('express');
const multer = require('multer');
const { analyzeResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route
router.post('/upload', protect, upload.single('resume'), analyzeResume);

module.exports = router;