import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import uploadImageToS3 from "../services/awsS3";
import {
  insertPlaylist,
  deletePlaylist,
  retrievePlaylists,
  insertPlaylistTrack,
  deletePlaylistTrack,
  retrievePlaylistTracks,
} from "../models/playlistModels";
import { grabTrackIds } from "../utils/helper";
import { getSpotifyTracks } from "../services/spotify";
import { getAccessToken } from "../models/tokenModels";
import { normalizeTrackData } from "../services/normalizeData";
import { getSoundcloudTracks } from "../services/soundcloud";

export const createPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { name } = req.body;
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadImageToS3(req.file);
      } catch (error) {
        // Handle S3 upload errors but continue creating playlist without image
        console.error("Failed to upload image:", error);
      }
    }
    const playlistId = await insertPlaylist(userId, name, imageUrl);
    return res
      .status(201)
      .json({ playlistId, imageUrl, message: "Playlist successfully created." });
  } catch (error) {
    next(error);
  }
};

export const removePlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId } = req.body;

    await deletePlaylist(userId, playlistId);
    return res.status(200).json({ message: "Playlist successfully removed." });
  } catch (error) {
    next(error);
  }
};

export const getPlaylists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;

    const playlists = await retrievePlaylists(userId);
    return res.status(200).json({ playlists, message: "Playlist successfully retrieved." });
  } catch (error) {
    next(error);
  }
};

export const addTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId, trackId, provider } = req.body;

    const playlistTrackId = insertPlaylistTrack(userId, playlistId, trackId, provider);
    return res.status(201).json({ message: "Track successfully added.", playlistTrackId });
  } catch (error) {
    next(error);
  }
};

export const removeTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId, trackId, provider } = req.body;
    await deletePlaylistTrack(userId, playlistId, trackId, provider);
    return res.status(200).json({ message: "Track successfully removed." });
  } catch (error) {
    next(error);
  }
};

export const getPlaylistTracks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId } = req.params;

    let trackIds;
    let accessToken;
    let trackData;
    let spotifyPlaylistTracks: any[] = [];
    let soundcloudPlaylistTracks: any[] = [];
    const playlistData = await retrievePlaylistTracks(Number(playlistId));

    trackIds = grabTrackIds(playlistData, "spotify");
    if (trackIds.length > 0) {
      accessToken = await getAccessToken(userId, "spotify");
      trackData = (await getSpotifyTracks(trackIds, accessToken)).tracks;
      spotifyPlaylistTracks = await normalizeTrackData("spotify", trackData, userId);
    }

    trackIds = grabTrackIds(playlistData, "soundcloud");
    if (trackIds.length > 0) {
      trackData = await getSoundcloudTracks(trackIds);
      soundcloudPlaylistTracks = await normalizeTrackData("soundcloud", trackData, userId);
    }

    return res
      .status(200)
      .json({
        playlistTracks: { spotifyPlaylistTracks, soundcloudPlaylistTracks },
        message: "Playlist tracks successfully retrieved.",
      });
  } catch (error) {
    next(error);
  }
};
