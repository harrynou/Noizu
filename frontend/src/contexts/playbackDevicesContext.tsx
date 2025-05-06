import {createContext, useContext, useState, useRef, useEffect, useCallback} from "react";
import {useAuth} from "./authContext";

interface PlaybackDevicesContextProps {
  spotifyPlayerRef: React.MutableRefObject<Spotify.Player | null>;
  soundCloudPlayerRef: React.MutableRefObject<SoundCloudWidget | null>;
  deviceId: string;
  loadingMusicPlayer: boolean;
  isPlayerInitialized: boolean;
}

const PlaybackDevicesContext = createContext<PlaybackDevicesContextProps | undefined>(undefined);

export const usePlaybackDevices = () => {
  const context = useContext(PlaybackDevicesContext);
  if (!context) {
    throw new Error("usePlaybackDevices must be used within PlaybackDevicesProvider");
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const PlaybackDevicesProvider = ({children}: ProviderProps) => {
  const [deviceId, setDeviceId] = useState<string>("");
  const [loadingMusicPlayer, setLoadingMusicPlayer] = useState<boolean>(true);
  const [loadingSpotifyPlayer, setLoadingSpotifyPlayer] = useState<boolean>(true);
  const [loadingSoundcloudPlayer, setLoadingSoundcloudPlayer] = useState<boolean>(true);
  const [isPlayerInitialized, setIsPlayerInitialized] = useState<boolean>(false);
  const spotifyPlayerRef = useRef<Spotify.Player | null>(null);
  const soundCloudPlayerRef = useRef<SoundCloudWidget | null>(null);
  const {getSpotifyToken} = useAuth();

  useEffect(() => {
    if (loadingSpotifyPlayer || loadingSoundcloudPlayer) return;
    setIsPlayerInitialized(true);
  }, [loadingSoundcloudPlayer, loadingSpotifyPlayer]);

  // Load and initialize both players when the app starts
  useEffect(() => {
    // Prevent unnecessary reinitialization
    if (!window.spotifyPlayer || !window.soundcloudPlayer) {
      Promise.all([
        !window.soundcloudPlayer ? loadSoundCloudSDK() : Promise.resolve(),
        !window.spotifyPlayer ? loadSpotifySDK() : Promise.resolve(),
      ])
        .then(() => {
          if (!window.spotifyPlayer) window.spotifyPlayer = spotifyPlayerRef.current;
          if (!window.soundcloudPlayer) window.soundcloudPlayer = soundCloudPlayerRef.current;

          spotifyPlayerRef.current = window.spotifyPlayer;
          soundCloudPlayerRef.current = window.soundcloudPlayer;

          console.log("Players initialized:");
          console.log("Spotify Player:", spotifyPlayerRef.current);
          console.log("SoundCloud Player:", soundCloudPlayerRef.current);

          setLoadingMusicPlayer(false);
        })
        .catch((error) => {
          console.error("Error loading SDKs:", error);
          setLoadingMusicPlayer(false);
        });
    } else {
      console.log("Players already initialized.");
      spotifyPlayerRef.current = window.spotifyPlayer;
      soundCloudPlayerRef.current = window.soundcloudPlayer;
      setLoadingMusicPlayer(false);
      setIsPlayerInitialized(true);
    }
  }, []);

  // Promise function to load spotify sdk
  const loadSpotifySDK = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (document.getElementById("spotify-web-sdk-script")) {
        console.log("Spotify SDK already loaded");
        resolve();
        return;
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        if (!spotifyPlayerRef.current) {
          initializeSpotifyPlayer().then(resolve);
        } else {
          resolve();
        }
      };
      const script = document.createElement("script");
      script.id = "spotify-web-sdk-script";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    });
  }, []);

  const initializeSpotifyPlayer = async () => {
    return new Promise<void>((resolve) => {
      const spotifyPlayer = new Spotify.Player({
        name: "Noizu Music App",
        getOAuthToken: async (cb) => {
          try {
            const token = await getSpotifyToken();
            cb(token);
          } catch (error) {
            console.error("Error fetching access token:", error);
          }
        },
        volume: 0.5, // Default volume
      });
      spotifyPlayerRef.current = spotifyPlayer;
      spotifyPlayer.addListener("ready", async ({device_id}) => {
        setLoadingSpotifyPlayer(false);
        setDeviceId(device_id);
        resolve();
      });

      // Add error event listeners
      spotifyPlayer.addListener("autoplay_failed", () => {
        console.log("Autoplay is not allowed by the browser autoplay rules");
      });
      spotifyPlayer.on("initialization_error", (e) => console.error(e));
      spotifyPlayer.on("authentication_error", (e) => console.error(e));
      spotifyPlayer.on("account_error", (e) => console.error(e));
      spotifyPlayer.on("playback_error", (e) => console.error(e));
      spotifyPlayer.connect();
    });
  };

  // Promise function to load soundcloud sdk
  const loadSoundCloudSDK = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (document.getElementById("soundcloud-widget-script")) {
        console.log("SoundCloud SDK already loaded");
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "soundcloud-widget-script";
      script.src = "https://w.soundcloud.com/player/api.js";
      script.async = true;
      script.onload = () => {
        if (!soundCloudPlayerRef.current) {
          initializeSoundCloudWidget().then(resolve);
        } else {
          resolve();
        }
      };
      document.body.appendChild(script);
    });
  }, []);

  const initializeSoundCloudWidget = () => {
    return new Promise<void>((resolve) => {
      if (soundCloudPlayerRef.current) {
        resolve();
        return;
      }
      let iframe = document.getElementById("soundcloud-player") as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "soundcloud-player";
        iframe.style.visibility = "hidden";
        iframe.width = "100%";
        iframe.height = "1px";
        iframe.allow = "autoplay; encrypted-media";
        iframe.src =
          "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2073684856&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_user=false&show_artwork=false&show_playcount=false&show_comments=false";
        document.body.appendChild(iframe);
      }
      const widget = window.SC.Widget(iframe);
      soundCloudPlayerRef.current = widget;
      widget.bind("ready", () => {
        console.log("SoundCloud Player is ready");
        setLoadingSoundcloudPlayer(false);
        resolve();
      });
    });
  };

  return (
    <PlaybackDevicesContext.Provider
      value={{
        spotifyPlayerRef,
        soundCloudPlayerRef,
        deviceId,
        loadingMusicPlayer,
        isPlayerInitialized,
      }}>
      {children}
    </PlaybackDevicesContext.Provider>
  );
};
