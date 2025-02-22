"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv = require("dotenv");
dotenv.config();
var pool = new pg_1.Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5432,
});
pool.connect()
    .then(function () { return console.log('Connected to PostgreSQL'); })
    .catch(function (err) { return console.error('Database connection error:', err); });
exports.default = pool;
