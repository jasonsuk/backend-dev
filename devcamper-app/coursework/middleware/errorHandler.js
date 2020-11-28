// Load custom error response class
const errorResponse = require('../utils/errorResponse');

// Middleware to handle errors
// To use, write app.use(errorHandler) in server.js

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `No bootcamp found for id ${err.value}`;
        error = new errorResponse(message, 404);
    }

    // Mongoose duplicated keys
    if (err.code === 11000) {
        const message = 'Duplicated id requested';
        error = new errorResponse(message, 400);
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        // Use the existing validation error messages
        const message = Object.values(err.errors).map((val) => val.message);
        error = new errorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error',
    });
};

module.exports = errorHandler;
