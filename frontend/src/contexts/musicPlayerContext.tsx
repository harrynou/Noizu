import { createContext, useContext, useEffect, useRef, useState, useMemo, useCallback} from 'react';
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
    currentVolume: number;
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
    position: number
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
    const isPlayingRef = useRef(false);
    const spotifyPlayerRef = useRef<Spotify.Player | null>(null);
    const soundCloudPlayerRef = useRef<SoundCloudWidget | null>(null);
    const [deviceId, setDeviceId] = useState<string>('');
    const {getSpotifyToken, user} = useAuth()
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const [loadingSessionState, setLoadingSessionState] = useState<boolean>(true);
    const [loadingMusicPlayer, setLoadingMusicPlayer] = useState<boolean>(true);
    const [currentProvider, setCurrentProvider] = useState<string | null>(null);
    const currentProviderRef = useRef<string | null>(null);
    const [currentVolume, setCurrentVolume] = useState<number>(user?.volume ?? 0.5);
    const currentVolumeRef = useRef<number>(currentVolume);
    const [finishedTrack, setFinishedTrack]= useState<boolean>(false);
    const isSeekingRef = useRef<boolean>(false);

    // Load previous states from session storage
    useEffect(() => {
        const savedState = sessionStorage.getItem("musicPlayerState");
        if (savedState) {
            try {
                const { queue, currentTrackIndex, currentPosition } = JSON.parse(savedState);
                setQueue(queue || []);
                setCurrentTrackIndex(currentTrackIndex ?? null);
                setCurrentPosition(currentPosition ?? 0);

            } catch (error) {
                console.error("Error parsing music player state:", error);
            }
        }
        setLoadingSessionState(false);
    }, []);

    // Sets volume page load
    useEffect(() => {
        if (user?.volume && !loadingMusicPlayer){
            setNewVolume(user.volume);
            console.log("Setting Default Volume, ", user.volume);
        }
    }, [user, loadingMusicPlayer])

    // Load and initialize both players when the app starts
    useEffect(() => {
        Promise.all([loadSoundCloudSDK(), loadSpotifySDK()])
        .then(() => {
            setLoadingMusicPlayer(false);
        })
        .catch((error) => {
            console.error("Error loading SDKs:", error);
            setLoadingMusicPlayer(false);
        });
        return () => {
            spotifyPlayerRef.current?.disconnect();

        };
    }, []);

    // Saves track state upon changes
    useEffect(() => {
        if (!loadingSessionState && !loadingMusicPlayer){
            sessionStorage.setItem("musicPlayerState", JSON.stringify({
                queue,
                currentTrackIndex,
                currentPosition
            }));
        }
    }, [queue, currentTrackIndex, currentPosition, loadingMusicPlayer]);


    // Keep ref in sync with state
    useEffect(() => {
        currentProviderRef.current = currentProvider;
        currentVolumeRef.current = currentVolume
    }, [currentProvider, currentVolume]);

    // Used to update spotify's track position
    useEffect(() => {
        if (!isPlaying || currentTrackIndex === null) return;

        let animationFrameId: number;
        const updatePosition = async () => {
            if (!spotifyPlayerRef.current || currentProviderRef.current !== 'spotify') {
                cancelAnimationFrame(animationFrameId); // Stop the loop if it's not Spotify
                return;
            }
            const state = await spotifyPlayerRef.current.getCurrentState();
            if (state && !isSeekingRef.current) {
                setCurrentPosition(state.position);
            }
            animationFrameId = requestAnimationFrame(updatePosition);
        };
        animationFrameId = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, currentTrackIndex, loadingMusicPlayer, currentProvider]);


    // Signals when track finishes
    useEffect(() => {
        if (!finishedTrack) return;
        if (currentTrackIndex !== null && currentTrackIndex + 1 < queue.length){
        setCurrentTrackIndex(currentTrackIndex+1);
    }
        setFinishedTrack(false);
    }, [finishedTrack]);

    const loadSpotifySDK = useCallback(() => {
        return new Promise<void>((resolve) => {
        if (document.getElementById('spotify-web-sdk-script')){ 
            console.log('Spotify SDK already loaded')
            return;
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            initializeSpotifyPlayer().then(resolve); 
        };
        const script = document.createElement('script');
        script.id = 'spotify-web-sdk-script';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
        });
    }, []);

    const initializeSpotifyPlayer = async () => {    
        return new Promise<void>((resolve) => {
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
                volume: currentVolume
            });
            spotifyPlayerRef.current = spotifyPlayer;
                spotifyPlayer.addListener('ready',async ({ device_id }) => {
                    setDeviceId(device_id);
                    resolve();
                });    
                spotifyPlayer.addListener('player_state_changed', (state) => {
                    if (state){
                        setIsPlaying(!state.paused);
                        setCurrentPosition(state.position)
                        if (state.position === 0 && state.track_window.previous_tracks.length > 0) {
                            console.log("Track ended, playing next track...");
                            setFinishedTrack(true);
                        }
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
        })
    };

    const loadSoundCloudSDK = useCallback(() => {
        return new Promise<void>((resolve) => {
            if (document.getElementById('soundcloud-widget-script')) {
                console.log("SoundCloud SDK already loaded");
                resolve();
                return;
            }
    
            const script = document.createElement('script');
            script.id = 'soundcloud-widget-script';
            script.src = 'https://w.soundcloud.com/player/api.js';
            script.async = true;
            script.onload = () => {
                initializeSoundCloudWidget().then(resolve);
            };
            document.body.appendChild(script);
        });
    }, []);

    const initializeSoundCloudWidget = () => {
        return new Promise<void>((resolve) => {
            if (soundCloudPlayerRef.current) {
                console.log("✅ SoundCloud Player already initialized.");
                resolve();
                return;
            }
            let iframe = document.getElementById('soundcloud-player') as HTMLIFrameElement;
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'soundcloud-player';
                iframe.style.visibility = 'hidden';
                iframe.width = "100%";
                iframe.height = "1px";
                iframe.allow = "autoplay; encrypted-media";
                iframe.src = 'https://w.soundcloud.com/player/?url=&auto_play=true&buying=false&liking=false&download=false&sharing=false&show_user=false&show_artwork=false';
                document.body.appendChild(iframe);
            };
            const widget = window.SC.Widget(iframe);
            soundCloudPlayerRef.current = widget;
            widget.bind("ready", () => {
                console.log('SoundCloud Player is ready')
                resolve();
            });
            widget.bind('play', () => {
                console.log('SoundCloud track started playing')
                soundCloudPlayerRef.current?.setVolume(currentVolumeRef.current * 100)
                isPlayingRef.current = true;
                if (isSeekingRef.current) seek(currentPosition);
            });
            widget.bind('pause', () => {console.log("Soundcloud Track Paused!")
                isPlayingRef.current = false;
                setIsPlaying(false);
            });
            widget.bind('finish', () => playNextTrack());
            widget.bind('playProgress', (progress:any) => {
                if (!isPlayingRef.current) return;
                console.log(progress.currentPosition)
                setCurrentPosition(progress.currentPosition)
                setIsPlaying(true);
            });
        })
        
    };

    const playTrack = useCallback((track: Track) => {
        setQueue([track]);
        setCurrentTrackIndex(0);
    }, []);
    
    // On reload of a page
    useEffect(() => {
        if (loadingSessionState || loadingMusicPlayer || !deviceId || currentTrackIndex === null) return;
        playCurrentTrack(currentTrackIndex);
        console.log(currentVolume);
    }, [currentTrackIndex, loadingSessionState, loadingMusicPlayer, deviceId]);

    const playCurrentTrack = async (index: number | null = currentTrackIndex, currentQueue: Track[] = queue) => {
        if (index === null || index < 0 || index >= currentQueue.length) {
            console.warn('Invalid current track index');
            return;
        }
        const currentTrack = currentQueue[index];
        
        if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
            setCurrentProvider('spotify');
            await spotifyPlayerRef.current.activateElement();
            const token = await getSpotifyToken()
            let options: startPlaybackOptions = {token, device_id:deviceId, uris:[currentTrack.uri], position: currentPosition}
            await startSpotifyPlayback(options);
        } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
            setCurrentProvider('soundcloud');
            soundCloudPlayerRef.current.load(currentTrack.uri, {auto_play: true});


        }
    };
    const playNextTrack = () => {
        if (currentTrackIndex !== null && currentTrackIndex < queue.length - 1) {
            setCurrentPosition(0);
            togglePause();
            setCurrentTrackIndex(currentTrackIndex + 1);
        } else {
            console.log("No more tracks in the queue.");
        }
    };

    const playPreviousTrack = () => {
        if (currentTrackIndex === null) return;
        if (currentTrackIndex > 0) {
            setCurrentPosition(0);
            togglePause();
            setCurrentTrackIndex(currentTrackIndex - 1);
        } else {
            seek(0);
        }
    };
    // Pauses all players
    const togglePause = useCallback(() => {
        if (spotifyPlayerRef.current) spotifyPlayerRef.current.pause();
        if (soundCloudPlayerRef.current) soundCloudPlayerRef.current.pause();
    }, [isPlaying])

    const togglePlayPause = useCallback(() => {
        if (currentTrackIndex === null) return;
        const currentTrack = queue[currentTrackIndex];
        if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
            isPlaying ? spotifyPlayerRef.current.pause() : spotifyPlayerRef.current.resume();
        } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
            isPlaying ? soundCloudPlayerRef.current.pause() : soundCloudPlayerRef.current.play();
        }
    }, [isPlaying, currentTrackIndex, queue]);

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
    
    const clearQueue = () => {
        setQueue([]);
    }

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
            setCurrentPosition(0);
            setCurrentTrackIndex(trackIndex);
        }
    };

    const seek = (position: number) => {
        isSeekingRef.current = true;
        if (currentProvider === 'spotify' && spotifyPlayerRef.current){
            spotifyPlayerRef.current.seek(position);
        } else if (currentProvider === 'soundcloud' && soundCloudPlayerRef.current){
            setCurrentPosition(position)
            soundCloudPlayerRef.current.seekTo(position);
        }
        isSeekingRef.current = false;
    };

    const setNewVolume = useCallback(async (volume: number) => { // Volume input from 0 to 1.0
        setCurrentVolume(volume);
        if (spotifyPlayerRef.current) spotifyPlayerRef.current.setVolume(volume);
        if (soundCloudPlayerRef.current) soundCloudPlayerRef.current.setVolume(volume * 100);
    }, []);
    const contextValue = useMemo(
        () => ({
            currentTrack: currentTrackIndex !== null ? queue[currentTrackIndex] : null,
            isPlaying,
            queue,
            currentPosition,
            currentProvider: currentProvider,
            currentVolume,
            playTrack,
            togglePlayPause,
            setNewVolume,
            addToQueue,
            removeFromQueue,
            clearQueue,
            reorderQueue,
            selectTrackToPlay,
            playNextTrack,
            playPreviousTrack,
            seek,
        }),
        [queue, currentTrackIndex, isPlaying, currentPosition, currentVolume, currentProviderRef]
    );
    
    return <MusicPlayerContext.Provider value={contextValue}>{children}</MusicPlayerContext.Provider>;
};

