const express = require('express');
const path = require('path');
const dotenv = require('dotenv'); // process.env - environment variable
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
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
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');

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

// Fileupload third party middleware
app.use(fileupload());

// Cookie parser third party middleware
app.use(cookieParser());

// Access files on browsers - static route to public folder
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/user', user);

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
