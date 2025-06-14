import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import { updateUserVolume } from "../models/playbackModels";

export const updateVolume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { newVolume } = req.body;
    await updateUserVolume(userId, newVolume);
    return res.status(200).json("Volume Updated.");
  } catch (error) {
    next(error);
  }
};
