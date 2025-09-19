import mysql from "mysql2/promise";
import { env } from "./env.js";

export const db = mysql.createPool({
    host: env.HOST,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
});
