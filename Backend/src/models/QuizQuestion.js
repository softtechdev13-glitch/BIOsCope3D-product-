const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Quiz = require('./Quiz');

const QuizQuestion = sequelize.define('QuizQuestion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quiz_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id',
    },
  },
  system_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSONB, // Stores array of { text: string, is_correct: boolean }
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = QuizQuestion;
