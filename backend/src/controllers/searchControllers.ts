import { Request, Response, NextFunction } from "express";
import { soundcloudQuery } from "../services/soundcloud";
import { spotifySearchQuery } from "../services/spotify";
import { getOldOrNewClientCredentials } from "../models/tokenModels";
import { verifyToken } from "../utils/jwt";
import { normalizeTrackData } from "../services/normalizeData";
import CacheService from "../services/cacheService";

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

    // Create cache key for search results (excluding userId for public caching)
    const cacheKey = `search:${provider}:${query.toLowerCase()}:${limit}:${offset}`;
    
    // Try to get cached results first
    const cachedResults = await CacheService.getCachedSearchResults(query.toLowerCase(), provider, limit, offset);
    
    if (cachedResults) {
      // If we have cached results, we still need to normalize them for the specific user
      // to get their favorite status, but we can skip the external API call
      const queryData = await normalizeTrackData(provider, cachedResults, userId);
      
      // For cached results, we need to determine hasMore based on the result count
      const hasMore = cachedResults.length === limit;
      
      return res.status(200).json({ 
        queryData, 
        hasMore,
        cached: true // Optional: indicate this was served from cache
      });
    }

    // If not in cache, fetch from external APIs
    const accessToken = await getOldOrNewClientCredentials(provider);
    let rawQueryData: any;
    
    if (provider === "spotify") {
      rawQueryData = await spotifySearchQuery(query, limit, offset, accessToken);
    } else if (provider === "soundcloud") {
      rawQueryData = await soundcloudQuery(query, limit, offset, accessToken);
    } else {
      return res.status(400).json({ error: "Unsupported provider" });
    }
    
    const { trackData, hasMore } = rawQueryData;
    
    // Cache the raw track data (before normalization to avoid user-specific data in cache)
    await CacheService.cacheSearchResults(query.toLowerCase(), provider, limit, offset, trackData);
    
    // Normalize the data for the specific user
    const queryData = await normalizeTrackData(provider, trackData, userId);
    
    return res.status(200).json({ 
      queryData, 
      hasMore,
      cached: false // Optional: indicate this was freshly fetched
    });
  } catch (error) {
    console.error('Search query error:', error);
    next(error);
  }
};
