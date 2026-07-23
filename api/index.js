const app = require('../Backend/src/app');
const { sequelize } = require('../Backend/src/models');

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await sequelize.authenticate();
    console.log('Database connected on Vercel.');
    isConnected = true;
  } catch (error) {
    console.error('Database connection error on Vercel:', error);
  }
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
