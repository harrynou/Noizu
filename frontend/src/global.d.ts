export {};

declare global {
    interface Window {
        soundcloudPlayer : SoundCloudWidget | null;
        SC : Widget = (iframe:HTMLIFrameElement) => SoundCloudWidget
        spotifyPlayer : any
    }

    interface SoundCloudWidget {
        Events: SoundCloudWidgetEvents;  // Define Events here
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

    type SoundCloudEvent = 'ready' | 'finish' | 'play' | 'pause' | 'playProgress' | 'loadProgress';

    interface SoundCloudWidgetEvents {
        READY: 'ready';
        FINISH: 'finish';
        PLAY: 'play';
        PAUSE: 'pause';
        PLAY_PROGRESS: 'playProgress';
        LOAD_PROGRESS: 'loadProgress';
    }
}
