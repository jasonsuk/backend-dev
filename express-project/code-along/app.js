const express = require('express');
const morgan = require('morgan');
const APIError = require('./utils/apiError');
const globalErrorHandler = require('./controllers/errorController');
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
    req.requestTime = new Date().toISOString(); // @to manipute req object
    next();
});

// Routing - @middleware to mount multiple routes
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

// Middlware : catching all requests that did not go trough the above routes.
// Must be located after all the normal html request, or the below will be executed no matter what requests
app.all('*', (req, res, next) => {
    // // METHOD 1)
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cannot find ${req.originalUrl} on the server`,
    // });
    // // METHOD 2) or instead create an object to pass onto the error handler middleware
    // const err = new Error(`Cannot find ${req.originalUrl} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);
    // // METHOD 3) REFACTORED : create and load a class in a seperate file
    next(new APIError(`Cannot find ${req.originalUrl} on the server`, 404));
});

// Syntax for error handler middleware @controllers/errorController.js
app.use(globalErrorHandler);

module.exports = app;
