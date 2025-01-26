import axios from "axios";
import qs from "qs";
import { setAccessToken, setClientCredenitals } from "../models/tokenModels";

export const refreshSoundcloudToken = async (userId: number, refresh_token: string): Promise<string> => {

    try {
        const response = await axios.post('https://secure.soundcloud.com/oauth/token',
            qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id:process.env.SOUNDCLOUD_CLIENT_ID,
            client_secret:process.env.SOUNDCLOUD_CLIENT_SECRET
          }),{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json; charset=utf-8'
        }
    });
        const {access_token, expires_in} = response.data
        await setAccessToken(userId, 'soundcloud', access_token, expires_in)
        return access_token
    } catch(error){
        throw error
    }
}


export const refreshSoundcloudClientCredentials = async (): Promise<string> => {
    try{
        const response = await axios.post('https://secure.soundcloud.com/oauth/token',
            qs.stringify({
            grant_type: 'client_credentials'
        }),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.SOUNDCLOUD_CLIENT_ID}:${process.env.SOUNDCLOUD_CLIENT_SECRET}`).toString('base64')}`
            },
        });
        const {access_token, expires_in} = response.data
        await setClientCredenitals('soundcloud', access_token, expires_in)
        return access_token
    } catch(error){
        throw error
    }
}

export const soundcloudQuery = async (query:string, accessToken:string):Promise<any> => {
    try {
        const response = axios.get('https://api.soundcloud.com/tracks?', {
        params: {q:query},
        headers: {
            "accept": "application/json; charset=utf-8",
            "Authorization": `OAuth ${accessToken}`
        }})
        return response   
    } catch (error) {
        throw error
    }
}