import { createContext, useContext, useEffect, useState } from "react";
import { addTrackToPlaylist, getPlaylists, modifyPlaylist, removeTrackFromPlaylist } from "../services/api";

interface PlaylistContextProps {
  playlists: Playlist[];
  addToPlaylist: (playlistId: number, trackId: string, provider: string) => void;
  removeFromPlaylist: (playlistId: number, trackId: string, provider: string) => void;
  editPlaylist: (playlistId: number, name?: string, playlistCover?: File) => void;
}

const PlaylistContext = createContext<PlaylistContextProps | undefined>(undefined);

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylistContext must be used within PlaylistProvider");
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const PlaylistProvider = ({ children }: ProviderProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    try {
      const playlistData = async () => {
        const playlistData = await getPlaylists();
        setPlaylists(playlistData);
      };
      playlistData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addToPlaylist = async (playlistId: number, trackId: string, provider: string) => {
    try {
      await addTrackToPlaylist(playlistId, trackId, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromPlaylist = async (playlistId: number, trackId: string, provider: string) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const editPlaylist = async (playlistId: number, name?: string, playlistCover?: File) => {
    try {
      await modifyPlaylist(playlistId, name, playlistCover);
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = { playlists, addToPlaylist, removeFromPlaylist, editPlaylist };

  return <PlaylistContext.Provider value={contextValue} children={children}></PlaylistContext.Provider>;
};
