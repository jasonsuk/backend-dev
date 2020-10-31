const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // @logger - morgan (3rd party)
}
// console.log(process.env.NODE_ENV);

app.use(express.json()); // @to handle req.body
app.use(express.static(`${__dirname}/public`)); // @ serving static files
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); // @to maniuplate req object
    next();
});

// Routing - @middleware to mount multiple routes
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

module.exports = app;
