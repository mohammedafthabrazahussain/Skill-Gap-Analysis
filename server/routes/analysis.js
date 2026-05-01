const express = require('express');
const { analyzeGap, getLearningPath, toggleResource } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/gap', protect, analyzeGap);
router.get('/learning-path/:skillId', protect, getLearningPath);
router.post('/toggle-resource', protect, toggleResource);

module.exports = router;
