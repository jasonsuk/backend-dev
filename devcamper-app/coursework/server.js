const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load routes
const bootcamps = require('./routes/bootcamps');

// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Dev logging middleware - 3rd party
app.use(morgan('dev')); // function with 'dev' parameter

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
    )
);
