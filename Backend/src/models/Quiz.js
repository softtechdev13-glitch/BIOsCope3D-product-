const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., 'Cardiovascular'
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false, // 'Basic', 'Advanced'
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Quiz;
