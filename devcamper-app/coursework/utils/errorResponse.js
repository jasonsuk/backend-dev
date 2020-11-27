// Create custom type error message
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        // Passing message to the existing constructor in Error
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = ErrorResponse;
