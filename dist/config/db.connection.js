"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const db_config_1 = require("./db.config");
exports.db = mysql2_1.default.createConnection({
    host: db_config_1.DBConfig.HOST,
    user: db_config_1.DBConfig.USER,
    password: db_config_1.DBConfig.PASSWORD,
    database: db_config_1.DBConfig.DB
}).promise();
