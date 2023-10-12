"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const tokenGenerator = (payload) => {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });
    return token;
};
exports.default = tokenGenerator;
