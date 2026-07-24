const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 8080;

// Lazy non-blocking database connection for Vercel Serverless
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
    console.log('Database connected.');
  } catch (error) {
    console.error('Database connection warning:', error.message);
  }
};

// Blocking DB connection check for Serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB Connection Error in Middleware:", err);
  }
  next();
});

// Run HTTP listener only when launched directly (e.g. node server.js)
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      try {
        await sequelize.query('ALTER TABLE "Bookmarks" ALTER COLUMN "item_id" TYPE VARCHAR(255);');
      } catch (e) {}
      await sequelize.sync({ alter: true });
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to start server:', error);
    }
  };
  startServer();
}

// Export app for Vercel Serverless Function handler
module.exports = app;
