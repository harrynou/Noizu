import axios from "axios";
import qs from "qs";
import { setAccessToken, setClientCredenitals } from "../models/tokenModels";


export const AuthSoundcloudToken = async (code:string, codeVerifier:string): Promise<{access_token:string, refresh_token:string, expires_in:number}> => {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', process.env.SOUNDCLOUD_CLIENT_ID || '');
        params.append('client_secret', process.env.SOUNDCLOUD_CLIENT_SECRET || '');
        params.append('redirect_uri', process.env.SOUNDCLOUD_REDIRECT_URI || '');
        params.append('code_verifier', codeVerifier);
        params.append('code', code);
        const response = await axios.post('https://secure.soundcloud.com/oauth/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json; charset=utf-8'
        }
    });
        const {access_token, refresh_token, expires_in} = response.data
        return {access_token, refresh_token, expires_in}
    } catch(error){
        throw error
    }
}

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

export const getSoundcloudUserInfo = async (accessToken: string): Promise<any>=> {
    try {
        const response = await axios.get('https://api.soundcloud.com/me',
        {headers: {
            'Content-Type': 'Accept: application/json; charset=utf-8',
            'Authorization': `OAuth ${accessToken}`
        },})
        return response.data
    } catch (error) {
        throw error
    }
    
}

export const soundcloudQuery = async (query:string, accessToken:string):Promise<any> => {
    try {
        const response = await axios.get('https://api-v2.soundcloud.com/search/tracks?', {
        params: {q:query, limit:10, client_id: `${process.env.SOUNDCLOUD_CLIENT_ID_V2}`},
        headers: {
            "accept": "application/json; charset=utf-8",
        }})
        return response.data
    } catch (error) {
        throw error
    }
}

export const getSoundcloudTracks = async (trackIds: string[]): Promise<any> => {
    try {
        // If no tracks, return empty array
        if (trackIds.length === 0) {
            return [];
        }
        
        // Handle batching for more than 50 tracks
        const batchSize = 50; // SoundCloud API limit
        const batches = [];
        
        // Split trackIds into batches of 50 or fewer
        for (let i = 0; i < trackIds.length; i += batchSize) {
            const batchIds = trackIds.slice(i, i + batchSize);
            batches.push(batchIds);
        }
        
        // Process each batch with the API and combine results
        const batchResults = await Promise.all(
            batches.map(batch => {
                return axios.get('https://api-v2.soundcloud.com/tracks', {
                    params: {
                        ids: batch.toString(),
                        client_id: `${process.env.SOUNDCLOUD_CLIENT_ID_V2}`
                    },
                    headers: {
                        "accept": "application/json; charset=utf-8",
                    }
                });
            })
        );
        
        // Combine results from all batches
        const allTracks = batchResults.reduce<any[]>((acc, response) => {
            return [...acc, ...response.data];
        }, []);
        
        return allTracks;
    } catch (error) {
        throw error;
    }
}