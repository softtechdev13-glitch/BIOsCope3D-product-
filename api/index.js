const app = require('../Backend/src/app');
const { sequelize } = require('../Backend/src/models');

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const authPromise = sequelize.authenticate();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 3000)
    );
    await Promise.race([authPromise, timeoutPromise]);
    isConnected = true;
    console.log('Database connected on Vercel.');
  } catch (error) {
    console.error('Vercel DB connection warning:', error.message);
  }
};

module.exports = async (req, res) => {
  connectDB().catch(() => {});
  return app(req, res);
};
