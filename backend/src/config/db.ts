import {Pool} from 'pg';
require('dotenv').config({ path: '../.env'})

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const connectDB = async (): Promise<void> => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connection established.");
    } catch (error) {
        throw new Error(`Database connection failed: ${error}`);
    }
};

export const insertUser = async (email:string, password_encrypted?:string): Promise<number> => {
    try {
        const results = await pool.query("INSERT INTO users (email,password_hash) VALUES ($1, $2) RETURNING user_id", [email,password_encrypted || null])
        return results.rows[0].user_id;
    } catch(error) {
        throw error;
    }
}

export const isProviderConnected = async (provider: string, provider_email?: string): Promise<boolean> => {
    try {
        const results = await pool.query("SELECT user_id FROM linked_accounts WHERE provider = $1 and provider_email = $2", [provider,provider_email])
        return results.rowCount === 1;
    } catch (error) {
        throw error
    }
}

export const registerByProvider = async (provider:string, provider_email:string, refresh_token:string): Promise<void> => {
    try {
        const user_id = await insertUser(provider_email);
        await connectProvider(user_id, provider, provider_email, refresh_token);
    } catch (error:any) {
        throw error
    }
}


export const connectProvider = async (user_id:number, provider:string, provider_email:string, refresh_token:string): Promise<void> => {
    try { 
        let provider_column: string;
        if (provider === 'spotify') {
            provider_column = 'spotify_account_id';
        } else if (provider === 'soundcloud') {
            provider_column = 'soundcloud_account_id';
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        const results = await pool.query("INSERT INTO linked_accounts (user_id,provider,provider_email,refresh_token) VALUES ($1,$2,$3,$4) RETURNING account_id",[user_id,provider,provider_email,refresh_token])
        const provider_account_id = results.rows[0].account_id
        const e = await pool.query(`UPDATE users SET ${provider_column} = $1 WHERE user_id = $2`, [provider_account_id, user_id])
    } catch(error:any){
        throw error
    }
}

export default pool;