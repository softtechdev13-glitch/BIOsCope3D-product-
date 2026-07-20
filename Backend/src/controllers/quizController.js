const { Quiz, QuizQuestion, User, UserProgress } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Get all available quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    let quizzes = await Quiz.findAll({
      attributes: ['id', 'title', 'description', 'category', 'difficulty', 'xp_reward'],
    });
    // Filter out the old dummy quiz that only has 2 questions
    quizzes = quizzes.filter(q => q.title !== 'Cardiovascular Basics');
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
};

// @desc    Get single quiz with 20 random questions
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Fetch exactly 20 random questions for the session separately to avoid Sequelize include limits/order issues
    const questions = await QuizQuestion.findAll({
      where: { quiz_id: quiz.id },
      order: sequelize.random(),
      limit: 20,
      attributes: ['id', 'question_text', 'options', 'explanation']
    });

    const quizData = quiz.toJSON();
    quizData.questions = questions;

    res.json(quizData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching quiz details' });
  }
};

// @desc    Submit quiz score and update user progress
// @route   POST /api/progress
// @access  Private
const submitProgress = async (req, res) => {
  try {
    const { quiz_id, score } = req.body;
    const userId = req.user.id;

    if (!quiz_id || score === undefined) {
      return res.status(400).json({ message: 'Quiz ID and Score are required' });
    }

    const quiz = await Quiz.findByPk(quiz_id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Record the progress
    await UserProgress.create({
      user_id: userId,
      quiz_id: quiz_id,
      score: score,
    });

    // Update user stats (XP and potentially level/streak logic can be expanded)
    const user = await User.findByPk(userId);
    user.xp += quiz.xp_reward;
    user.streak += 1; // Simplified streak logic
    
    // Simple leveling logic (every 500 XP = 1 level)
    user.level = Math.floor(user.xp / 500) + 1;
    
    await user.save();

    // Send result email
    const { sendQuizResultEmail } = require('../services/emailService');
    await sendQuizResultEmail(user.email, user.full_name, quiz.title, score, 20); // assuming max 20

    res.status(201).json({
      message: 'Progress saved successfully',
      new_xp: user.xp,
      new_level: user.level,
      new_streak: user.streak
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving progress' });
  }
};

// @desc    Get user's quiz history
// @route   GET /api/quizzes/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await UserProgress.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Quiz, attributes: ['title', 'difficulty'] }],
      order: [['completed_at', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

// @desc    Download PDF of quiz history
// @route   GET /api/quizzes/history/pdf
// @access  Private
const downloadHistoryPdf = async (req, res) => {
  try {
    let PDFDocument;
    try {
      PDFDocument = require('pdfkit');
    } catch (e) {
      return res.status(500).json({ message: 'PDF generator not installed. Run "npm install pdfkit" in the backend directory.' });
    }

    const history = await UserProgress.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Quiz, attributes: ['title', 'difficulty'] }],
      order: [['completed_at', 'DESC']]
    });

    const doc = new PDFDocument();
    
    // Set response headers to force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Quiz_History.pdf');
    
    doc.pipe(res);
    
    // Document styling
    doc.fontSize(25).text('BioScope 3D - Quiz History', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Generated on: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    if (history.length === 0) {
      doc.text('No quiz history found.');
    } else {
      history.forEach((h, index) => {
        doc.fontSize(16).text(`${index + 1}. ${h.Quiz.title} (${h.Quiz.difficulty} Mode)`);
        doc.fontSize(12).text(`Score: ${h.score} / ${h.total_questions}`);
        doc.fontSize(10).text(`Date: ${new Date(h.completed_at).toLocaleString()}`);
        doc.moveDown();
      });
    }

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error generating PDF' });
    }
  }
};

// @desc    Get up to 20 random questions for a specific body system
// @route   GET /api/quizzes/system/:systemName
// @access  Private
const getSystemQuiz = async (req, res) => {
  try {
    const { systemName } = req.params;
    
    // Fetch up to 20 random questions for this system across both basic and advanced quizzes
    const questions = await QuizQuestion.findAll({
      where: { system_name: systemName },
      order: sequelize.random(),
      limit: 20,
      attributes: ['id', 'question_text', 'options', 'explanation']
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: `No questions found for ${systemName}` });
    }

    // Return a virtual quiz object so the frontend can reuse the same screen
    res.json({
      id: `system_${systemName}`,
      title: `${systemName} Quiz`,
      xp_reward: 50, // Custom reward for system-specific quizzes
      questions: questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching system quiz' });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  submitProgress,
  getHistory,
  downloadHistoryPdf,
  getSystemQuiz,
};
