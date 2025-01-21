import axios from "axios";
import qs from "qs";

export const refreshSpotifyToken = async (refresh_token: string): Promise<string> => {

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
          }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
    });
    
    return response.data.access_token
    } catch(error){
        throw error
    }
}