import { Request, Response, NextFunction } from 'express';
import {User} from '../utils/types'
import uploadImageToS3 from '../services/awsS3';
import { insertPlaylist } from '../models/playlistModels';

export const getPlaylists = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;

        // const playlists = await retrievePlaylists(userId);
        // return res.status(200).json({playlists});
    } catch (error) {
        next(error);
    }
};

export const createPlaylist = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;
        const {name} = req.body;
        const {file} = req;
        let imageUrl = null;
        if (file){
            imageUrl = await uploadImageToS3(file);
        }
        imageUrl ? await insertPlaylist(userId, name, imageUrl): await insertPlaylist(userId,name);
        res.status(200).json(imageUrl);
    } catch (error) {
        next(error);
    }
};

export const addTrack = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;


    } catch (error) {
        next(error);
    }
};

export const removeTrack = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;


    } catch (error) {
        next(error);
    }
};

