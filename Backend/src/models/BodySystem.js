const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BodySystem = sequelize.define('BodySystem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  icon: {
    type: DataTypes.STRING, // e.g., '🦴', '🫀'
  },
  bgColor: {
    type: DataTypes.STRING, // e.g., '#F5F5F5'
  },
  elementCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sketchfabId: {
    type: DataTypes.STRING,
  },
  thumbnail_url: {
    type: DataTypes.STRING,
  },
  cameraEye: {
    type: DataTypes.JSON, // Stores array e.g., [0, -200, -50]
  },
  cameraTarget: {
    type: DataTypes.JSON, // Stores array e.g., [0, -10, 0]
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = BodySystem;
