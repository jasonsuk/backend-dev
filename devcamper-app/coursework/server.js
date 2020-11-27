const express = require('express');
const dotenv = require('dotenv'); // process.env - environment variable
const morgan = require('morgan'); // logger middleware
const colors = require('colors'); // style console log (https://github.com/marak/colors.js/)
const errorHandler = require('./middleware/errorHandler');

const connectDB = require('./config/db');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Load routes
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body parser @ POST
app.use(express.json());

// Dev logging middleware - 3rd party
app.use(morgan('dev')); // function with 'dev' parameter

// Middleware : show request time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/bootcamps', bootcamps);

// Error handler - must be written after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5500;
const server = app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
            .bgYellow.black
    )
);

// Handle database promise error : UnhandledPromiseRejectionWarning
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // Close server & exit process with fail
    server.close(() => process.exit(1));
});
