export {};

declare global {
  interface Window {
    soundcloudPlayer: SoundCloudWidget | null;
    SC: Widget = (iframe: HTMLIFrameElement) => SoundCloudWidget;
    spotifyPlayer: any;
  }

  interface SoundCloudWidget {
    Events: SoundCloudWidgetEvents; // Define Events here
    load: (url: string, options?: { auto_play?: boolean }) => void;
    bind: (event: SoundCloudEvent, callback: (data?: any) => void) => void;
    unbind: (event: SoundCloudEvent) => void;
    play: () => void;
    pause: () => void;
    toggle: () => void;
    seekTo: (milliseconds: number) => void;
    setVolume: (volume: number) => void;
    getVolume: (callback: any) => void;
    isPaused: (callback: any) => void;
  }

  type SoundCloudEvent = "ready" | "finish" | "play" | "pause" | "playProgress" | "loadProgress";

  interface SoundCloudWidgetEvents {
    READY: "ready";
    FINISH: "finish";
    PLAY: "play";
    PAUSE: "pause";
    PLAY_PROGRESS: "playProgress";
    LOAD_PROGRESS: "loadProgress";
  }

  interface Track {
    id: string;
    uri: string;
    title: string;
    artistInfo: Artist[];
    imageUrl?: string;
    provider: string;
    duration: number;
    isFavorited: boolean;
    favoritedAt: string;
  }

  interface Artist {
    name: string;
    id: string;
    profileUrl: string;
  }

  interface UserType {
    volume: number;
  }

  interface Playlist {
    playlistId: number;
    name: string;
    imageUrl: string | null;
    userId: number;
    createdAt: string;
    trackCount: number;
    updatedAt: string;
    lastPlayedAt: string;
  }

  interface PlaylistTrack extends Track {
    playlist_track_id?: number;
    added_at?: string;
  }
}
