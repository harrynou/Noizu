import pool from "../config/db";
import { favoriteTrack } from "../controllers/trackControllers";

export const toggleFavorite = async (userId: number, trackId: string, provider: string): Promise<void> => {
    try {
        const exists = await pool.query('SELECT * FROM favorites WHERE user_id = $1 AND track_id = $2 AND provider = $3', [userId, trackId, provider]);
        if (exists.rowCount && exists.rowCount > 0){
            const favoriteId = exists.rows[0].favorite_id;
            const deletion = await pool.query('DELETE FROM favorites WHERE favorite_id = $1', [favoriteId]);
        } else {
            const insert = await pool.query('INSERT INTO favorites(user_id, provider, track_id) VALUES ($1,$2,$3)', [userId, provider, trackId]);
        }
    } catch (error) {
        throw error;
    }
} 

export const retrieveFavorites = async (userId: number, provider?: string, trackIds?: string[]): Promise<string[]> => {
    try {
        let query = 'SELECT track_id FROM favorites WHERE user_id = $1';
        const params: any[] = [userId];
        if (provider) {
            query += ' AND provider = $2';
            params.push(provider);
        }
        if (trackIds && trackIds.length > 0) {
            query += ' AND track_id = ANY($3::text[])';
            params.push(trackIds);
        }
        const results = await pool.query(query, params);
        const favoriteTrackIds = results.rows.map(row => row.track_id);
        return favoriteTrackIds
    } catch (error) {
        throw error;
    }
}