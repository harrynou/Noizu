export {};

declare global {
    interface Window {
        SC: {
            Widget: (iframeElement: HTMLIFrameElement) => SoundCloudWidget;
        };
    }

    interface SoundCloudWidget {
        Events: SoundCloudWidgetEvents;  // Define Events here
        load: (url: string, options?: { auto_play?: boolean }) => void;
        bind: (event: SoundCloudEvent, callback: (data?: any) => void) => void;
        play: () => void;
        pause: () => void;
        toggle: () => void;
        seekTo: (milliseconds: number) => void;
        setVolume: (volume: number) => void;
    }

    type SoundCloudEvent = 'ready' | 'finish' | 'play' | 'pause' | 'playProgress';

    interface SoundCloudWidgetEvents {
        READY: 'ready';
        FINISH: 'finish';
        PLAY: 'play';
        PAUSE: 'pause';
        PLAY_PROGRESS: 'playProgress';
    }
}
