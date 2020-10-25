const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware @to handle req.body
app.use(express.json());

// Middleware @to maniuplate req object
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Middleware @logger - morgan (3rd party)
app.use(morgan('dev'));

// Routing - @middleware to mount multiple routes
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

module.exports = app;
