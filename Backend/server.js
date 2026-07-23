const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 8080;

// Lazy database connection for Vercel Serverless Function execution
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    isConnected = true;
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Ensure DB connection on incoming requests
app.use(async (req, res, next) => {
  await connectDB();
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
