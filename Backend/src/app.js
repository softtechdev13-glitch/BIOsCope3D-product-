const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}
}
app.use('/uploads', express.static(uploadsDir));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BioScope 3D API', status: 'online' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to BioScope 3D API', status: 'online' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
