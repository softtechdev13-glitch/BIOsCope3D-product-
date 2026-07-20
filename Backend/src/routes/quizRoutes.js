const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById, submitProgress, getHistory, downloadHistoryPdf, getSystemQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getQuizzes);
router.get('/history', protect, getHistory);
router.get('/history/pdf', protect, downloadHistoryPdf);
router.get('/system/:systemName', protect, getSystemQuiz);
router.get('/:id', protect, getQuizById);
router.post('/progress', protect, submitProgress);

module.exports = router;
