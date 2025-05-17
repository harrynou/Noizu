import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const connectDB = async (): Promise<void> => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connection established.");
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error(`Database connection failed: ${error}`);
    }
};

export default pool;