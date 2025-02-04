import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getAccessToken, transferSpotifyPlayback, startSpotifyPlayback} from '../services/api';

interface Track {
    id: string;
    uri: string; 
    title: string;
    artist: string;
    imageUrl?: string;
    provider: string;
}

interface MusicPlayerContextProps {
    currentTrack: Track | null;
    isPlaying: boolean;
    queue: Track[];
    playTrack: (track: Track) => void;
    addToQueue: (track: Track) => void;
    removeFromQueue: (trackId: string) => void;
    reorderQueue: (startIndex: number, endIndex: number) => void;
    selectTrackToPlay: (trackIndex: number) => void;
    playNextTrack: () => void;
    playPreviousTrack: () => void;
    togglePlayPause: () => void;
}

interface TransferPlaybackOptions {
    token: string | null;
    device_id: string;
}
interface startPlaybackOptions {
    token: string | null;
    device_id: string;
    uris: string[];
}


const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (!context) {
        throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
    }
    return context;
};

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<Track[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const spotifyPlayerRef = useRef<Spotify.Player | null>(null);
    const soundCloudPlayerRef = useRef<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string>('');


    useEffect(() => {
        // Load and initialize both players when the app starts
        loadSpotifySDK();
        loadSoundCloudSDK();
    }, []);

    const loadSpotifySDK = () => {
        if (document.getElementById('spotify-web-sdk-script')) {
            console.log('Spotify SDK script already loaded');
            return;
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('Spotify Web Playback SDK is ready.');
            initializeSpotifyPlayer(); 
        };
    
        const script = document.createElement('script');
        script.id = 'spotify-web-sdk-script';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
    
        document.body.appendChild(script);
    };

    let spotifyPlayerInitialized = false;
    const initializeSpotifyPlayer = async () => {    
        if (spotifyPlayerInitialized) {
            console.log('Spotify player already initialized');
            return;
        }
        spotifyPlayerInitialized = true;
        const spotifyPlayer = new Spotify.Player({
            name: 'My Music App',
            getOAuthToken: async (cb) => {
                try {
                    const newToken = await getAccessToken('spotify');
                    setToken(newToken);
                    cb(newToken);
                } catch (error) {
                    console.error("Error fetching access token:", error);
                }
            },
            volume: 0.5,
        });
    
            spotifyPlayer.addListener('ready',async ({ device_id }) => {
                setDeviceId(device_id)
                console.log('Spotify Player is ready with Device ID:', device_id);
            });

            spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });    
    
            spotifyPlayer.addListener('player_state_changed', (state) => {
                if (!state){
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                }
                setIsPlaying(!state.paused);
                if (state.paused && state.position === 0) {
                    playNextTrack();
                }
            });
            spotifyPlayer.addListener('autoplay_failed', () => {
                console.log('Autoplay is not allowed by the browser autoplay rules');
            });
            spotifyPlayer.on('initialization_error', e => console.error(e));
            spotifyPlayer.on('authentication_error', e => console.error(e));
            spotifyPlayer.on('account_error', e => console.error(e));
            spotifyPlayer.on('playback_error', e => console.error(e));

            spotifyPlayer.connect();
            spotifyPlayerRef.current = spotifyPlayer;
    };
    

    const loadSoundCloudSDK = () => {
        const script = document.createElement('script');
        script.src = 'https://w.soundcloud.com/player/api.js';
        script.async = true;

        script.onload = () => {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/977120290&auto_play=false';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const soundCloudPlayer = window.SC.Widget(iframe);
            soundCloudPlayer.bind(window.SC.Events.READY, () => {
                console.log('SoundCloud Player is ready');
            });
            soundCloudPlayerRef.current = soundCloudPlayer;
        };

        document.body.appendChild(script);
    };

    const playTrack = (track: Track) => {
        setQueue([track]);  // Replace the queue with the single track
        setCurrentTrackIndex(0);

        playCurrentTrack();
    };

    const playCurrentTrack = async (index: number | null = currentTrackIndex, currentQueue: Track[] = queue) => {
        if (index === null || index < 0 || index >= currentQueue.length) {
            console.warn('Invalid current track index');
            return;
        }
    
        const currentTrack = currentQueue[index];
        if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
            await spotifyPlayerRef.current.activateElement();
            await startSpotifyPlayback({token, device_id:deviceId, uris:[currentTrack.uri]});
        } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
            soundCloudPlayerRef.current.load(currentTrack.uri, { auto_play: true });
        }
    
        setIsPlaying(true);
    };
    const playNextTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex < queue.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
            playCurrentTrack();
        }
    };

    const playPreviousTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
            playCurrentTrack();
        }
    };
    

    const togglePlayPause = () => {
        if (currentTrackIndex === null || currentTrackIndex < 0 || currentTrackIndex >= queue.length) {
            console.warn('No track is currently selected for playback');
            return;
        }
    
        const currentTrack = queue[currentTrackIndex];
        if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
            if (isPlaying) {
                spotifyPlayerRef.current.pause();
            } else {
                spotifyPlayerRef.current.resume();
            }
        } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
            soundCloudPlayerRef.current.toggle();  // Use SoundCloud's toggle method
        }
    
        setIsPlaying(!isPlaying);
    };

    const addToQueue = (track: Track) => {
        setQueue((prevQueue) => {
            const updatedQueue = [...prevQueue, track];
    
            // Start playback if no track is currently playing
            if (currentTrackIndex === null) {
                setCurrentTrackIndex(0);
                playCurrentTrack(0, updatedQueue);  // Pass the updated state to playCurrentTrack
            }
    
            return updatedQueue;
        });
    };

    const removeFromQueue = (trackId: string) => {
        setQueue((prevQueue) => {
            const updatedQueue = prevQueue.filter((track) => track.id !== trackId);
    
            // Handle the case where the removed track is currently playing
            if (currentTrackIndex !== null && queue[currentTrackIndex]?.id === trackId) {
                setCurrentTrackIndex((prevIndex) => {
                    if (prevIndex === null) return null;
    
                    // If the current index is beyond the updated queue length, reset to null
                    if (updatedQueue.length === 0) return null;
    
                    // If there's a next track, play it
                    return prevIndex >= updatedQueue.length ? 0 : prevIndex;
                });
    
                playNextTrack();
            }
    
            return updatedQueue;
        });
    };

    const reorderQueue = (startIndex: number, endIndex: number) => {
        setQueue((prevQueue) => {
            const updatedQueue = [...prevQueue];
            const [movedTrack] = updatedQueue.splice(startIndex, 1);
            updatedQueue.splice(endIndex, 0, movedTrack);
            return updatedQueue;
        });
    };

    const selectTrackToPlay = (trackIndex: number) => {
        if (trackIndex >= 0 && trackIndex < queue.length) {
            setCurrentTrackIndex(trackIndex);
            playCurrentTrack();
        }
    };

    return (
        <MusicPlayerContext.Provider
            value={{
                currentTrack: currentTrackIndex !== null ? queue[currentTrackIndex] : null,
                isPlaying,
                queue,
                playTrack,
                addToQueue,
                removeFromQueue,
                reorderQueue,
                selectTrackToPlay,
                playNextTrack,
                playPreviousTrack,
                togglePlayPause,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

