const express = require('express');
const dotenv = require('dotenv');   // process.env - environment variable 
const morgan = require('morgan');   // logger middleware
const colors = require('colors');     // style console log (https://github.com/marak/colors.js/)

const connectDB = require('./config/db');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Load routes
const bootcamps = require('./routes/bootcamps');

const app = express();

// Dev logging middleware - 3rd party
app.use(morgan('dev')); // function with 'dev' parameter

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5500;
const server = app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold
    )
);

// Handle database promise error : UnhandledPromiseRejectionWarning
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // Close server & exit process with fail
    server.close(() => process.exit(1));        
})