const express = require('express');
const router = express.Router();
const { chatWithTutor } = require('../controllers/tutorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithTutor);

module.exports = router;
