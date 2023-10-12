"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const selloutRoutes = express_1.default.Router();
const sellout_controller_1 = __importDefault(require("../controller/sellout.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
selloutRoutes.get("/", (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin', 'sales'] }), sellout_controller_1.default.findAllSellout);
selloutRoutes.get("/:id", (0, auth_middleware_1.authorizationMiddleware)({ role: ['admin', 'sales'] }), sellout_controller_1.default.findSelloutId);
selloutRoutes.post("/", (0, auth_middleware_1.authorizationMiddleware)({ role: ['sales'] }), sellout_controller_1.default.inputSellout);
selloutRoutes.put("/:id", (0, auth_middleware_1.authorizationMiddleware)({ role: ['sales'] }), sellout_controller_1.default.updateSelloutData);
selloutRoutes.delete("/:id", (0, auth_middleware_1.authorizationMiddleware)({ role: ['sales'] }), sellout_controller_1.default.deleteSellout);
exports.default = selloutRoutes;
