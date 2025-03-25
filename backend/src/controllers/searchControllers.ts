import {Request, Response, NextFunction} from 'express'
import { soundcloudQuery } from '../services/soundcloud'
import { spotifySearchQuery } from '../services/spotify';
import { getOldOrNewClientCredentials } from '../models/tokenModels';
import { verifyToken } from '../utils/jwt';
import { normalizeTrackData } from '../services/normalizeData';
import { Providers } from '../utils/types';




export const searchQuery = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.cookies.authToken;
        let userId: number | undefined = undefined;
        if (authToken) {
            const user =  verifyToken(authToken);
            userId = user.userId;
        }
        const {query, provider} = req.params;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Query parameter is required and must be a string." });
        }

        const accessToken = await getOldOrNewClientCredentials(provider);
        let rawQueryData: any;
        if (provider === 'spotify'){
            rawQueryData = (await spotifySearchQuery(query,accessToken)).tracks.items; 
        } else if (provider === 'soundcloud'){
            rawQueryData = (await soundcloudQuery(query, accessToken)).collection;
        }
        const queryData = await normalizeTrackData(provider, rawQueryData, userId);
        return res.status(200).json({queryData});
    } catch (error) {
        next(error)
    }
}





