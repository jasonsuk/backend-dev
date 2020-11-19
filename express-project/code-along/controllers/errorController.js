const APIError = require('./../utils/apiError');

// DB ERROR HANDLER FUNCTION
function handleCastErrorDB(err) {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new APIError(message, 400);
}

// HELPER FUNCTION
function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
}

function sendErrorProd(err, res) {
    // Operational error
    if (err.operational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        // Programming or other unknown error - hide details to the client
    } else {
        // Log error
        console.log('Unexpected err', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong with the server',
        });
    }
}

// EXPORT GLOBAL ERROR HANDLER MIDDLEWARE
module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    // SEPERATE ERROR MESSAGE : DEVELOPMENT VS PRODUCTION
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        console.log(error);
        if (error.name === 'CastError') error = handleCastErrorDB(error);

        sendErrorProd(error, res);
    }

    next();
};
