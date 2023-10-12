"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const sellout_route_1 = __importDefault(require("./routes/sellout.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const error_handling_1 = __importDefault(require("./middleware/error.handling"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yaml = __importStar(require("js-yaml")); // Import js-yaml
const openapi_validator_1 = require("express-openapi-validator/dist/openapi.validator");
const fs_1 = __importDefault(require("fs"));
const routes = express_1.default.Router();
const app = (0, express_1.default)();
const apiSpecPath = './doc/openapi.yaml'; // Adjust the path to your OpenAPI spec
// Serve Swagger UI
const swaggerDocument = yaml.load(fs_1.default.readFileSync(apiSpecPath, 'utf8')) || {};
app.use('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Create an OpenApiValidator instance and configure it
const openApiValidator = new openapi_validator_1.OpenApiValidator({
    apiSpec: apiSpecPath,
    validateRequests: true,
    validateResponses: true, // Enable response validation
});
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(routes);
routes.use('/auth', auth_route_1.default);
routes.use('/user', auth_middleware_1.authenticationMiddleware, user_route_1.default);
routes.use('/sellout', auth_middleware_1.authenticationMiddleware, sellout_route_1.default);
app.use(error_handling_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
