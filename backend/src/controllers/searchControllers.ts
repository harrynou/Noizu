import {Request, Response, NextFunction} from 'express'
import { soundcloudQuery } from '../services/soundcloud'
import { spotifyQuery } from '../services/spotify';
import { getOldOrNewClientCredentials } from '../models/tokenModels';
import { verifyToken } from '../utils/jwt';
import { normalizeSearchData } from '../services/normalizeData';
import { Providers } from '../utils/types';




export const searchQuery = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.cookies.authToken;
        let userId: number | undefined = undefined;
        const {query, provider} = req.params;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Query parameter is required and must be a string." });
        }

        const accessToken = await getOldOrNewClientCredentials(provider);
        let rawQueryData: any;
        if (provider === 'spotify'){
            rawQueryData = await spotifyQuery(query,accessToken); 
        } else if (provider === 'soundcloud'){
            rawQueryData = await soundcloudQuery(query, accessToken);
        }
        const queryData = await normalizeSearchData(provider, rawQueryData);
        return res.status(200).json({queryData});
    } catch (error) {
        //console.error("Error in searchQuery:", error);
        next(error)
    }
}





