const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Migration fix: Alter Bookmarks item_id column to VARCHAR if it was INTEGER
    try {
      await sequelize.query('ALTER TABLE "Bookmarks" ALTER COLUMN "item_id" TYPE VARCHAR(255);');
    } catch (e) {
      // Column might already be VARCHAR or table doesn't exist yet
    }

    // Sync models (alter: true will update the database schema without dropping tables)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
