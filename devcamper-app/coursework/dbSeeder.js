// @DESC : Used to provide two functionalities on console
//  1. clear(destory) database
//  2. insert local data (@../_data) into from database

// Load modules
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

// Load Bootcamp model
const Bootcamp = require('./models/Bootcamps');
const Course = require('./models/Courses');
const User = require('./models/User');
const Review = require('./models/Review');

// Run database
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// Load local data file
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`),
    'utf-8'
);

// Import data into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log(
            'Data imported successfully to bootcamps collection'.green.inverse
        );
    } catch (error) {
        console.error(error);
    }
};

// Clear data from DB @ before importing data
const destoryDB = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('bootcamps collection database destoryed'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit();
    }
};

// Control import and destory on console
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destoryDB();
}
