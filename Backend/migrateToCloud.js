require('dotenv').config();
const { Sequelize } = require('sequelize');

// Local DB connection
const localDbUrl = process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/bioscope3d';
// Cloud DB connection
const cloudDbUrl = process.env.DATABASE_URL;

if (!cloudDbUrl || cloudDbUrl.includes('[YOUR-PASSWORD]')) {
  console.error('ERROR: Please set a valid DATABASE_URL with your actual password in Backend/.env first!');
  process.exit(1);
}

const localSequelize = new Sequelize(localDbUrl, { dialect: 'postgres', logging: false });
const cloudSequelize = new Sequelize(cloudDbUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

const migrate = async () => {
  try {
    console.log('Connecting to Local Database...');
    await localSequelize.authenticate();
    console.log('Connected to Local Database.');

    console.log('Connecting to Cloud Supabase Database...');
    await cloudSequelize.authenticate();
    console.log('Connected to Cloud Database.');

    // 1. Sync Cloud DB Models
    const models = require('./src/models');
    // Switch models to cloud instance
    await models.sequelize.sync({ alter: true });
    console.log('Cloud database tables synchronized.');

    console.log('Migration ready. If you want to populate initial systems & quizzes, run:');
    console.log('  node seedData.js');
    console.log('  node seedQuiz.js');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await localSequelize.close();
    await cloudSequelize.close();
  }
};

migrate();
