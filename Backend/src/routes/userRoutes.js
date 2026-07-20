const express = require('express');
const router = express.Router();
const { getUserProfile, updateStudyTime, uploadProfileImage, getLastActivity } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/profile', protect, getUserProfile);
router.post('/study-time', protect, updateStudyTime);
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.get('/last-activity', protect, getLastActivity);

module.exports = router;
