import pool from '../config/db'


export const insertPlaylist = async (userId:number, name:string, imageUrl?:string) => {
    try {
        let query = 'INSERT INTO playlists (user_id, name) VALUES ($1,$2)';
        let params = [userId, name];
        if (imageUrl){
            query = 'INSERT INTO playlists (user_id, name, image_url) VALUES ($1,$2,$3)';
            params.push(imageUrl);
        }
        const result = await pool.query(query, params);
    } catch (error) {
        throw error;    
    }
}