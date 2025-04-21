import { Request, Response, NextFunction } from 'express';
import {User} from '../utils/types'



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
        // const user = req.user as User;
        // const userId = user.userId;
        const {name, image_url} = req.body;
        res.status(200).json(req.file);
        // await insertPlaylist(userId, name, image_url)
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

