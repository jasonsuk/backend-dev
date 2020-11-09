const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Tour = require('../models/tourModel');

dotenv.config({ path: '../config.env' });

// CONNECT TO THE DATABSE
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connected to load the local data'))
  .catch((err) => console.log(err.message));

// FETCH LOCAL DATA
const filePath = path.join(
  __dirname,
  '..',
  'dev-data',
  'data',
  'tours-simple.json'
);
const localTourData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// LOAD THE LOCAL DATA TO THE DATABASE
const clearDB = async () => {
  try {
    await Tour.deleteMany();
    console.log('Database has been clear.');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const loadLocalDataToDB = async () => {
  try {
    await Tour.create(localTourData);
    console.log('Database has been updated with the local database');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--delete') {
  clearDB();
} else if (process.argv[2] === '--load') {
  loadLocalDataToDB();
} else {
  console.log('Invalid command');
}
