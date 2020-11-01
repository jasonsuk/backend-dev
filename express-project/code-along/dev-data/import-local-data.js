// ONE-TIME IMPORT A LOCAL JSON DATA TO THE MONGO DB CLOUD DATABASE
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Tour = require('../models/tourModel');

dotenv.config({ path: './config.env' });

// CONNECT TO MONGO DB CLOUD
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((con) => console.log('DB has been successfully connected'))
    .catch((err) => console.error(err.message));

// READ THE LOCAL FILE
const filePath = path.join(__dirname, 'data', 'tours-simple.json');
const localTourData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// FUNCTION TO IMPORT THE LOCAL TOUR DATA
const importDataToDB = async () => {
    try {
        await Tour.create(localTourData);
        console.log(
            'Local Tour Data has been succuessfully imported to the database!'
        );
    } catch (err) {
        console.error(err.message);
    }
    process.exit();
};

// DELETE ALL THE EXISTING DATA IN THE DATABASE
// [IMPORTANT!!!] ONLY USE WHEN INTENDING TO RECREATE THE DATABSE WITH NEW DATA
const deleteAllDataInDB = async () => {
    try {
        await Tour.deleteMany();
        console.log(
            'The current Tour collection is now completely clear with no data'
        );
    } catch (err) {
        console.error(err.message);
    }
    process.exit();
};

// COMMAND-LINE OPERATION TO IMPORT/DELETE DATA TO/FROM DATABASE
// console.log(process.argv);
// node dev-data/import-local-data.js --import

if (process.argv[2] === '--delete') {
    deleteAllDataInDB();
} else if (process.argv[2] === '--import') {
    importDataToDB();
} else {
    console.log('You command is not existing yet');
}
