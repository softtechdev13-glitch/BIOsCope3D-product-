const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const BodySystem = require('./BodySystem');

const Organ = sequelize.define('Organ', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  system_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: BodySystem,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  key_facts: {
    type: DataTypes.TEXT,
  },
  functions: {
    type: DataTypes.TEXT,
  },
  clinical_diseases: {
    type: DataTypes.TEXT,
  },
  model_url: {
    type: DataTypes.STRING, // Optional 3D model reference
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Organ;
