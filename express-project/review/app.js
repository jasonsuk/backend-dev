const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRouter');

const app = express();

// MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.json());

// Routing
app.use('/api/review/tours', tourRouter);

module.exports = app;
