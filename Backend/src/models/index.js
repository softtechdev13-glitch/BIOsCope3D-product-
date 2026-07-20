const { sequelize } = require('../config/database');
const User = require('./User');
const Quiz = require('./Quiz');
const QuizQuestion = require('./QuizQuestion');
const UserProgress = require('./UserProgress');
const BodySystem = require('./BodySystem');
const Organ = require('./Organ');
const UserActivity = require('./UserActivity');
const Bookmark = require('./Bookmark');
const Otp = require('./Otp');

// Associations
User.hasMany(UserProgress, { foreignKey: 'user_id' });
UserProgress.belongsTo(User, { foreignKey: 'user_id' });

Quiz.hasMany(QuizQuestion, { foreignKey: 'quiz_id', as: 'questions' });
QuizQuestion.belongsTo(Quiz, { foreignKey: 'quiz_id' });

Quiz.hasMany(UserProgress, { foreignKey: 'quiz_id' });
UserProgress.belongsTo(Quiz, { foreignKey: 'quiz_id' });

BodySystem.hasMany(Organ, { foreignKey: 'system_id', as: 'organs' });
Organ.belongsTo(BodySystem, { foreignKey: 'system_id' });

User.hasMany(UserActivity, { foreignKey: 'user_id' });
UserActivity.belongsTo(User, { foreignKey: 'user_id' });

Organ.hasMany(UserActivity, { foreignKey: 'organ_id' });
UserActivity.belongsTo(Organ, { foreignKey: 'organ_id' });

User.hasMany(Bookmark, { foreignKey: 'user_id' });
Bookmark.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Quiz,
  QuizQuestion,
  UserProgress,
  BodySystem,
  Organ,
  UserActivity,
  Bookmark,
  Otp,
};
