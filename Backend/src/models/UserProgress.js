const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Quiz = require('./Quiz');

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  quiz_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_questions: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'completed_at',
  updatedAt: false,
});

module.exports = UserProgress;
