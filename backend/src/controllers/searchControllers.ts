import { Request, Response, NextFunction } from "express";
import { soundcloudQuery } from "../services/soundcloud";
import { spotifySearchQuery } from "../services/spotify";
import { getOldOrNewClientCredentials } from "../models/tokenModels";
import { verifyToken } from "../utils/jwt";
import { normalizeTrackData } from "../services/normalizeData";

export const searchQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.cookies.authToken;
    let userId: number | undefined = undefined;
    if (authToken) {
      const user = verifyToken(authToken);
      userId = user.userId;
    }
    let { query, provider } = req.params;
    const limit = Number(req.params.limit);
    const offset = Number(req.params.offset);
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required and must be a string." });
    }

    const accessToken = await getOldOrNewClientCredentials(provider);
    let rawQueryData: any;
    if (provider === "spotify") {
      rawQueryData = await spotifySearchQuery(query, limit, offset, accessToken);
    } else if (provider === "soundcloud") {
      rawQueryData = await soundcloudQuery(query, limit, offset, accessToken);
    }
    const { trackData, hasMore } = rawQueryData;
    const queryData = await normalizeTrackData(provider, trackData, userId);
    return res.status(200).json({ queryData, hasMore });
  } catch (error) {
    next(error);
  }
};
