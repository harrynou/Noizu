import axios from "axios";
import qs from "qs";
import { setAccessToken, setClientCredenitals } from "../models/tokenModels";
import { verifyToken } from "../utils/jwt";

export const refreshSpotifyToken = async (userId: number, refresh_token: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    const { access_token, expires_in } = response.data;
    await setAccessToken(userId, "spotify", access_token, expires_in);
    return access_token;
  } catch (error: any) {
    console.error("Error refreshing Spotify user token:", error.response?.data || error.message);
    throw error;
  }
};

export const refreshSpotifyClientCredentials = async (): Promise<string> => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    const { access_token, expires_in } = response.data;
    await setClientCredenitals("spotify", access_token, expires_in);
    return access_token;
  } catch (error: any) {
    console.error("Error refreshing Spotify client credentials:", error.response?.data || error.message);
    throw error;
  }
};

export const spotifySearchQuery = async (
  query: string,
  limit: number,
  offset: number,
  accessToken: string
): Promise<any> => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: { q: query, limit, offset, type: "track", market: "US" },
    });
    const trackData = response.data.tracks.items;
    const hasMore = response.data.tracks.next ? true : false;
    return { trackData, hasMore };
  } catch (error) {
    throw error;
  }
};

export const getSpotifyTracks = async (trackIds: string[], accessToken: string): Promise<any> => {
  try {
    // If no tracks, return empty object with empty tracks array
    if (trackIds.length === 0) {
      return { tracks: [] };
    }

    const batchSize = 50; // Spotify API limit
    const batches = [];

    // Split trackIds into batches of 50 or fewer
    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batchIds = trackIds.slice(i, i + batchSize);
      batches.push(batchIds);
    }

    const batchResults = await Promise.all(
      batches.map((batch) => {
        return axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          params: { ids: batch.toString() },
        });
      })
    );

    // Combine results from all batches
    const allTracks = batchResults.reduce<any[]>((acc, response) => {
      return [...acc, ...response.data.tracks];
    }, []);

    return { tracks: allTracks };
  } catch (error) {
    throw error;
  }
};
