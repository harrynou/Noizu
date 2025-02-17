import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {startSpotifyPlayback} from '../services/api';
import { useAuth } from './authContext';
interface Track {
    id: string;
    uri: string; 
    title: string;
    artists: any;
    imageUrl?: string;
    provider: string;
    duration: number;
}

interface MusicPlayerContextProps {
    currentTrack: Track | null;
    currentPosition: number;
    currentProvider: string | null;
    currentVolume: number | null;
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
    seek: (position: number) => void;
    setNewVolume: (volume: number) => void;
}

interface startPlaybackOptions {
    token: string,
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
    const soundCloudPlayerRef = useRef<SoundCloudWidget | null>(null);
    const [deviceId, setDeviceId] = useState<string>('');
    const {getSpotifyToken, user} = useAuth()
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const currentProviderRef = useRef<string | null>(null);
    const [currentVolume, setCurrentVolume] = useState<number | null>(user ? user?.volume : null);

    useEffect(() => {
        // Load and initialize both players when the app starts
        loadSpotifySDK();
        loadSoundCloudSDK();
    }, []);


    useEffect(() => {
        setCurrentVolume(user ? user?.volume : null)
    }, [user])

    useEffect(() => {
        if (currentTrackIndex !== null) {
            const currentTrack = queue[currentTrackIndex];
            if (currentTrack.provider === 'spotify') {
                currentProviderRef.current = 'spotify';
                soundCloudPlayerRef.current?.pause();
            } else if (currentTrack.provider === 'soundcloud'){
                currentProviderRef.current = 'soundcloud';
                spotifyPlayerRef.current?.pause();
            }
            playCurrentTrack(currentTrackIndex);
        }
    }, [currentTrackIndex]);

    useEffect(() => {
        if (!isPlaying || currentTrackIndex === null) return;
    
        let animationFrameId: number;
        const updatePosition = async () => {
            if (!spotifyPlayerRef.current || currentProviderRef.current !== 'spotify') {
                cancelAnimationFrame(animationFrameId); // Stop the loop if it's not Spotify
                return;
            }
    
            const state = await spotifyPlayerRef.current.getCurrentState();
            if (state) {
                setCurrentPosition(state.position);
            }
            animationFrameId = requestAnimationFrame(updatePosition);
        };
        if (currentProviderRef.current === 'spotify') {
            animationFrameId = requestAnimationFrame(updatePosition);
        }
    
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, currentTrackIndex, currentProviderRef.current]);

    const loadSpotifySDK = () => {
        if (document.getElementById('spotify-web-sdk-script')) {
            console.log('Spotify SDK script already loaded');
            return;
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            initializeSpotifyPlayer(); 
        };
    
        const script = document.createElement('script');
        script.id = 'spotify-web-sdk-script';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
    };

    const initializeSpotifyPlayer = async () => {    
        const spotifyPlayer = new Spotify.Player({
            name: 'My Music App',
            getOAuthToken: async (cb) => {
                try {
                    const token = await getSpotifyToken()
                    cb(token);
                } catch (error) {
                    console.error("Error fetching access token:", error);
                }
            },
            volume: currentVolume ? currentVolume : 0.5,
        });
        
            spotifyPlayer.addListener('ready',async ({ device_id }) => {setDeviceId(device_id)});    
            spotifyPlayer.addListener('player_state_changed', (state) => {
                if (state){
                    setIsPlaying(!state.paused);
                    setCurrentPosition(state.position)
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
        if (!document.getElementById('soundcloud-widget-script')) {
            const script = document.createElement('script');
            script.id = 'soundcloud-widget-script';
            script.src = 'https://w.soundcloud.com/player/api.js';
            script.async = true;
    
            // Ensure initialization happens only after the script loads
            script.onload = () => {
                console.log('SoundCloud Widget script loaded');
                initializeSoundcloudWidget();
            };
    
            document.body.appendChild(script);
        }
    };

    const initializeSoundcloudWidget = () => {
        let iframe = document.getElementById('soundcloud-player') as HTMLIFrameElement;
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'soundcloud-player';
            iframe.allow = 'autoplay';
            iframe.style.display = 'none';
            iframe.src = 'https://w.soundcloud.com/player/?url=';
    
            document.body.appendChild(iframe);
        };

            const widget = window.SC.Widget(iframe);
            widget.bind('ready', () => {
            console.log('SoundCloud Player is ready');
        });
    
        widget.bind("play", () => {
            console.log('SoundCloud track started playing');
        });
    
        widget.bind('pause', () => {
            console.log('SoundCloud track paused');
        });

        widget.bind('playProgress', (progress:any) => {
            const position = progress.currentPosition;  // Position in milliseconds
        
            setCurrentPosition(position);
        });
        soundCloudPlayerRef.current = widget;
    };

    const playTrack = (track: Track) => {
        setQueue([track]);  // Replace the queue with the single track
        setCurrentTrackIndex(0);
    };

    const playCurrentTrack = async (index: number | null = currentTrackIndex, currentQueue: Track[] = queue) => {
        if (index === null || index < 0 || index >= currentQueue.length) {
            console.warn('Invalid current track index');
            return;
        }
        const currentTrack = currentQueue[index];
        setCurrentPosition(0);
        if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
            currentProviderRef.current = 'spotify';
            await spotifyPlayerRef.current.activateElement();
            const token = await getSpotifyToken()
            let options: startPlaybackOptions = {token, device_id:deviceId, uris:[currentTrack.uri]}
            await startSpotifyPlayback(options);
        } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
            currentProviderRef.current = 'soundcloud';
            soundCloudPlayerRef.current.load(currentTrack.uri, { auto_play: true });
        }
        setIsPlaying(true);
    };
    const playNextTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex < queue.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
        }
    };

    const playPreviousTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
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
            soundCloudPlayerRef.current.toggle(); 
        }
    
        setIsPlaying(!isPlaying);
    };

    const addToQueue = (track: Track) => {
        setQueue((prevQueue) => {
            const updatedQueue = [...prevQueue, track];
    
            // Start playback if no track is currently playing
            if (currentTrackIndex === null) {
                setCurrentTrackIndex(0);
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
        }
    };

    const seek = (position: number) => {
        if (currentProviderRef.current === 'spotify' && spotifyPlayerRef.current){
            spotifyPlayerRef.current.seek(position);
        } else if (currentProviderRef.current === 'soundcloud' && soundCloudPlayerRef.current){
            soundCloudPlayerRef.current.seekTo(position);
        }
    };

    const setNewVolume = (volume: number) => { // Volume expected to be from 0.0 to 1.0
        if (spotifyPlayerRef.current){
            spotifyPlayerRef.current.setVolume(volume); // spotify expects range from 0.0 to 1.0
            console.log("setting sound for spotify");
        }
        if (soundCloudPlayerRef.current){
            soundCloudPlayerRef.current.setVolume(volume * 100);  // soundcloud expects range 0 to 100
            console.log("setting sound for soundcloud");
        }
        setCurrentVolume(volume);
    }

    return (
        <MusicPlayerContext.Provider
            value={{
                currentTrack: currentTrackIndex !== null ? queue[currentTrackIndex] : null,
                isPlaying,
                queue,
                currentPosition,
                currentProvider: currentProviderRef.current ? currentProviderRef.current : null,
                currentVolume,
                playTrack,
                addToQueue,
                removeFromQueue,
                reorderQueue,
                selectTrackToPlay,
                playNextTrack,
                playPreviousTrack,
                togglePlayPause,
                seek,
                setNewVolume,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

