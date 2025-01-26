import axios from "axios";
import qs from "qs";
import { setAccessToken, setClientCredenitals } from "../models/tokenModels";
import { verifyToken } from "../utils/jwt";

export const refreshSpotifyToken = async (userId: number, refresh_token: string): Promise<string> => {

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
        const {access_token, expires_in} = response.data
        await setAccessToken(userId, 'spotify', access_token, expires_in)
        return access_token
    } catch(error: any){
        console.error('Error refreshing Spotify user token:', error.response?.data || error.message);
        throw error
    }
}

export const refreshSpotifyClientCredentials = async (): Promise<string> => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            qs.stringify({
                grant_type: 'client_credentials',
              }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
                }
            }
        )
        const {access_token, expires_in} = response.data
        await setClientCredenitals('spotify', access_token, expires_in)
        return access_token
    } catch (error:any) {
        console.error('Error refreshing Spotify client credentials:', error.response?.data || error.message);
        throw error
    }
}

export const spotifyQuery = async (query:string, accessToken: string):Promise<any> => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: 'Bearer ' + accessToken,

            },
            params: {q:query, type:'track', market:'US'}})
        return response.data
    } catch (error) {
        throw error
    }
}

export const spotifyFullResults = async (href: string, accessToken: string): Promise<any> => {
    try {
        const response = await axios.get(href, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            }
        })
        console.log(response.data.tracks.items)
        return response.data
    } catch (error) {
        throw error
    }
}