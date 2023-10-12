"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
userRoutes.post('/', (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin'] }), user_controller_1.default.createUser);
userRoutes.get('/', (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin'] }), user_controller_1.default.findAllUser);
userRoutes.get('/:id', (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin', 'sales'] }), user_controller_1.default.findUserId);
userRoutes.put('/:id', (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin'] }), user_controller_1.default.updateUserData);
userRoutes.delete('/:id', (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin'] }), user_controller_1.default.deleteUser);
exports.default = userRoutes;
