"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = exports.authorizationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticationMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.role = payload.role;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Token Invalid' });
    }
};
exports.authenticationMiddleware = authenticationMiddleware;
const authorizationMiddleware = ({ role }) => (req, res, next) => {
    if (!role.includes(req.role || '')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};
exports.authorizationMiddleware = authorizationMiddleware;
