export {};

declare global {
    interface Window {
        SC: {
            Widget: (iframeElement: HTMLIFrameElement) => SoundCloudWidget;
            Events: SoundCloudWidgetEvents;
        };
    }
}

interface SoundCloudWidget {
    load: (url: string, options?: { auto_play?: boolean }) => void;
    bind: (event: SoundCloudEvent, callback: () => void) => void;
    play: () => void;
    pause: () => void;
}

type SoundCloudEvent = 'ready' | 'finish' | 'play' | 'pause';

interface SoundCloudWidgetEvents {
    READY: 'ready';
    FINISH: 'finish';
    PLAY: 'play';
    PAUSE: 'pause';
}
