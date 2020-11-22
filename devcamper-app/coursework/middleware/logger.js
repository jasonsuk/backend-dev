// Dev logging middleware - custom
exports.logger = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(
            `${req.method} : ${req.protocol}://${req.get('host')}${
                req.originalUrl
            }`
        );
    }
    next();
};
