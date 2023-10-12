"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define a custom error class that extends Error
class CustomError extends Error {
    status;
    errors;
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}
const errorHandlerMiddleware = (err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
};
exports.default = errorHandlerMiddleware;
