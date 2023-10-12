import mysql from 'mysql2';
import { DBConfig } from './db.config';

export const db = mysql.createConnection({
    host: DBConfig.HOST,
    user: DBConfig.USER,
    password: DBConfig.PASSWORD,
    database: DBConfig.DB
}).promise()