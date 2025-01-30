import {Request, Response, NextFunction} from 'express'
import { soundcloudQuery } from '../services/soundcloud'
import { spotifyQuery } from '../services/spotify';
import { getOldOrNewClientCredentials } from '../models/tokenModels';
import { verifyToken } from '../utils/jwt';
import { normalizeSearchData } from '../services/normalizeData';




export const searchQuery = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.cookies.authToken;
        let userId: number | undefined = undefined;
        const {query} = req.params;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Query parameter is required and must be a string." });
        }
        const spotifyAccessToken = await getOldOrNewClientCredentials('spotify');
        const spotifyData = await spotifyQuery(query, spotifyAccessToken);
        const normalizedData = await normalizeSearchData('spotify', spotifyData);
        /* TODO: Implement soundcloud logic

        const [spotifyAccessToken, soundcloudAccessToken] = await Promise.all([
            getOldOrNewToken("spotify", userId),
            getOldOrNewToken("soundcloud", userId),
        ]);
        const [spotifyData,soundcloudData] = await Promise.all([
            spotifyQuery(query, spotifyAccessToken),
            soundcloudQuery(query, soundcloudAccessToken) 
        ])*/
        return res.status(200).json({ normalizedData });
        //console.log(spotifyData)
        // console.log(soundcloudData)
    } catch (error) {
        //console.error("Error in searchQuery:", error);
        next(error)
    }
}





