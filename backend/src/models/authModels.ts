import pool from '../config/db'


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
    } catch (error) {
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
    } catch(error){
        throw error
    }
}

export const getUserPassword = async (email:string): Promise<string> => { // Password returned is hashed
    try {
        const results = await pool.query("SELECT password FROM users WHERE email = $1", [email])
        return results.rows[0].email
    } catch (error){
        throw error
    } 
}

export const getUserId = async (email:string): Promise<string> => {
    try {
        const results = await pool.query("SELECT user_id FROM users WHERE email = $1", [email])
        return results.rows[0].user_id
    } catch (error){
        throw error
    } 
}