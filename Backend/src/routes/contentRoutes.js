const express = require('express');
const router = express.Router();
const { getSystems, getSystemOrgans, getRecentLearning, logActivity } = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/systems', getSystems);
router.get('/systems/:id/organs', getSystemOrgans);
router.get('/recent', protect, getRecentLearning);
router.post('/activity', protect, logActivity);

module.exports = router;
