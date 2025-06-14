import axios, { AxiosInstance } from "axios";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(new Error("An unexpected error occurred."));
  }
);

// APIs dealing with Authentication

export const checkAuth = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/api/auth/checkAuth");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const registerUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/auth/registerUser", { email, password });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/auth/signIn", { email, password });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/settings/changePassword", { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setUpAccount = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/settings/setupAccount", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post("/api/auth/logout");
  } catch (error) {
    throw error;
  }
};

export const getAccessToken = async (provider: string): Promise<string> => {
  try {
    const response = await axiosInstance.post("/api/auth/token", { provider: provider });
    const token = response.data.token;
    return token;
  } catch (error) {
    throw error;
  }
};

export const setUserVolume = async (newVolume: number): Promise<void> => {
  try {
    await axiosInstance.put("/api/playback/volume", { newVolume });
  } catch (error) {
    throw error;
  }
};

// APIs

export const searchQuery = async (
  query: string,
  provider: string,
  limit: number,
  offset: number
): Promise<{ queryData: Track[]; hasMore: boolean }> => {
  try {
    const response = await axiosInstance.get(`/api/search/${query}/${provider}/${limit}/${offset}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const favoriteTrack = async (trackId: string, provider: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post("/api/track/favorite", { trackId, provider });
    return response.status === 200 || response.status === 201;
  } catch (error) {
    throw error;
  }
};

export const unfavoriteTrack = async (trackId: string, provider: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete("/api/track/favorite", {
      data: { trackId, provider },
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error unfavoriting track:", error);
    throw error;
  }
};

export const getFavoriteTracks = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/api/track/favorite");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// APIs dealing with Spotify

interface TransferPlaybackOptions {
  token: string | null;
  device_id: string;
}

export const transferSpotifyPlayback = async ({ token, device_id }: TransferPlaybackOptions): Promise<void> => {
  const requestBody = { device_ids: [device_id], play: false };
  try {
    await axios.put("https://api.spotify.com/v1/me/player", requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error transferring playback:", error);
    throw error;
  }
};

interface startPlaybackOptions {
  token: string;
  device_id: string;
  uris: string[];
  position: number;
}

export const startSpotifyPlayback = async ({
  token,
  device_id,
  uris,
  position,
}: startPlaybackOptions): Promise<void> => {
  const requestBody = { uris, position_ms: position };
  try {
    await axios.put(`https://api.spotify.com/v1/me/player/play/?device_id=${device_id}`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error in starting playback:", error);
  }
};

// APIs for playlists

export interface Playlist {
  playlistId: number;
  name: string;
  imageUrl: string | null;
  userId: number;
  createdAt: string;
}

export interface PlaylistTrack extends Track {
  playlist_track_id?: number;
  added_at?: string;
}

export interface PlaylistTracksResponse {
  spotifyPlaylistTracks: PlaylistTrack[];
  soundcloudPlaylistTracks: PlaylistTrack[];
}

// Get all playlists for the current user
export const getPlaylists = async (): Promise<Playlist[]> => {
  try {
    const response = await axiosInstance.get("/api/playlists");
    return response.data.playlists || [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

// Get tracks for a specific playlist
export const getPlaylistTracks = async (playlistId: number): Promise<PlaylistTracksResponse> => {
  try {
    const response = await axiosInstance.get(`/api/playlists/${playlistId}/tracks`);
    return {
      spotifyPlaylistTracks: response.data.playlistTracks.spotifyPlaylistTracks || [],
      soundcloudPlaylistTracks: response.data.playlistTracks.soundcloudPlaylistTracks || [],
    };
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error;
  }
};

// Create a new playlist
export const createPlaylist = async (name: string, playlistCover?: File): Promise<Playlist> => {
  try {
    const formData = new FormData();
    formData.append("name", name);

    if (playlistCover) {
      formData.append("playlistCover", playlistCover);
    }

    const response = await axiosInstance.put("/api/playlists", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
};

// Delete a playlist
export const deletePlaylist = async (playlistId: number): Promise<void> => {
  try {
    await axiosInstance.delete("/api/playlists", { data: { playlistId } });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    throw error;
  }
};

// Add a track to a playlist
export const addTrackToPlaylist = async (playlistId: number, trackId: string, provider: string): Promise<void> => {
  try {
    await axiosInstance.put("/api/playlists/track", {
      playlistId,
      trackId,
      provider,
    });
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw error;
  }
};

// Remove a track from a playlist
export const removeTrackFromPlaylist = async (playlistId: number, trackId: string, provider: string): Promise<void> => {
  try {
    await axiosInstance.delete("/api/playlists/track", {
      data: {
        playlistId,
        trackId,
        provider,
      },
    });
  } catch (error) {
    console.error("Error removing track from playlist:", error);
    throw error;
  }
};

// Types for user profile and connections
export interface UserProfile {
  email: string;
  createdAt: string;
  lastUpdatedPassword: Date;
  lastUpdated: Date;
}

export interface UserConnections {
  spotify?: {
    connected: boolean;
    displayName: string;
    premiumAccount: boolean;
    lastConnected: Date;
  };
  soundcloud?: {
    connected: boolean;
    displayName: string;
    premium: number;
    lastConnected: Date;
  };
}

// User Profile APIs
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get("/api/settings/profile");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (updates: {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<void> => {
  try {
    await axiosInstance.put("/api/user/profile", updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Connections APIs
export const getConnections = async (): Promise<UserConnections> => {
  try {
    const response = await axiosInstance.get("/api/settings/connections");
    return response.data;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};

export const disconnectProvider = async (provider: "spotify" | "soundcloud"): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/settings/disconnect/${provider}`);
  } catch (error) {
    console.error(`Error disconnecting ${provider}:`, error);
    throw error;
  }
};

// Account management APIs
export const deleteAccount = async (password: string): Promise<void> => {
  try {
    await axiosInstance.delete("/api/user/account", {
      data: { password },
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
