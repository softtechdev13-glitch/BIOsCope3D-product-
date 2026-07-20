const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default DB
  port: 5432,
});

async function createDatabase() {
  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_catalog.pg_database WHERE datname = \'bioscope3d\'');
    if (res.rowCount === 0) {
      console.log('Database bioscope3d not found, creating it...');
      await client.query('CREATE DATABASE bioscope3d');
      console.log('Database bioscope3d created successfully.');
    } else {
      console.log('Database bioscope3d already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();
