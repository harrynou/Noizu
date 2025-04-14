import React, { useState, useEffect } from 'react';
import SearchBar from "../components/search/SearchBar";
import { useSearchResult } from "../contexts/searchResultContext";
import { useMusicPlayer } from "../contexts/musicPlayerContext";
import { useAuth } from "../contexts/authContext";

// Logo imports
import SpotifyIcon from '../assets/spotify/Icon.svg';
import SoundcloudIcon from '../assets/soundcloud/Icon.svg';
import QueueManager from '../components/playback/QueueManager';
import ItemCard from '../components/search/ItemCard';

const HomePage: React.FC = (): JSX.Element => {
    const { spotifyTracks, soundcloudTracks } = useSearchResult();
    const { currentTrack, isPlaying, togglePlayPause } = useMusicPlayer();
    const { isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'spotify' | 'soundcloud'>('all');
    const [showQueue, setShowQueue] = useState<boolean>(false);
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

    // Set search performed flag based on tracks
    useEffect(() => {
        if (spotifyTracks.length > 0 || soundcloudTracks.length > 0) {
            setSearchPerformed(true);
        }
    }, [spotifyTracks, soundcloudTracks]);

    const toggleQueueDisplay = () => {
        setShowQueue(!showQueue);
    };

    // Render welcome or no results message
    const renderEmptyState = () => {
        if (!searchPerformed) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-textPrimary py-20">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Noizu</h2>
                    <p className="text-gray-300 max-w-md mb-6">
                        Search for your favorite songs across Spotify and SoundCloud in one place.
                        {!isAuthenticated && " Sign in to save favorites and create playlists."}
                    </p>
                    <div className="flex gap-4 mb-8">
                        <img src={SpotifyIcon} alt="Spotify" className="w-12 h-12" />
                        <img src={SoundcloudIcon} alt="SoundCloud" className="w-12 h-12" />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Try searching for an artist, song, or album</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-textPrimary flex flex-col items-center justify-center py-20">
                    <h3 className="text-xl font-medium mb-3">No results found</h3>
                    <p className="text-gray-400">Try a different search term</p>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col p-4 md:p-6 flex-grow text-textPrimary">
            {/* Hero section with search bar */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Find Your Perfect Song</h1>
                <SearchBar onSearch={() => setSearchPerformed(true)} />
            </div>
            
            {/* Main content section */}
            <div className="flex flex-1 gap-4">
                {/* Results area */}
                <div className={`flex-1 ${showQueue ? 'md:w-2/3' : 'w-full'}`}>
                    {/* Tabs */}
                    {(spotifyTracks.length > 0 || soundcloudTracks.length > 0) && (
                        <div className="mb-4 border-b border-gray-700">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`py-2 px-4 ${activeTab === 'all' ? 'border-b-2 border-accentPrimary text-white' : 'text-gray-400'}`}
                                >
                                    All Results
                                </button>
                                <button
                                    onClick={() => setActiveTab('spotify')}
                                    className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'spotify' ? 'border-b-2 border-accentPrimary text-white' : 'text-gray-400'}`}
                                >
                                    <img src={SpotifyIcon} alt="Spotify" className="w-4 h-4" />
                                    Spotify {spotifyTracks.length > 0 && `(${spotifyTracks.length})`}
                                </button>
                                <button
                                    onClick={() => setActiveTab('soundcloud')}
                                    className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'soundcloud' ? 'border-b-2 border-accentPrimary text-white' : 'text-gray-400'}`}
                                >
                                    <img src={SoundcloudIcon} alt="SoundCloud" className="w-4 h-4" />
                                    SoundCloud {soundcloudTracks.length > 0 && `(${soundcloudTracks.length})`}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Results list */}
                    <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                        {(spotifyTracks.length === 0 && soundcloudTracks.length === 0) ? (
                            renderEmptyState()
                        ) : (
                            <div>
                                {activeTab === 'all' && (
                                    <>
                                        {spotifyTracks.length > 0 && (
                                            <div className="mb-6">
                                                <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                                                    <img src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />
                                                    Spotify Results
                                                </h2>
                                                {spotifyTracks.slice(0, 5).map((track) => (
                                                    <ItemCard key={track.id} item={track} provider={track.provider}/>
                                                ))}
                                                {spotifyTracks.length > 5 && (
                                                    <button 
                                                        onClick={() => setActiveTab('spotify')}
                                                        className="text-accentPrimary hover:underline text-sm"
                                                    >
                                                        Show all {spotifyTracks.length} Spotify results
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        
                                        {soundcloudTracks.length > 0 && (
                                            <div>
                                                <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                                                    <img src={SoundcloudIcon} alt="SoundCloud" className="w-5 h-5" />
                                                    SoundCloud Results
                                                </h2>
                                                {soundcloudTracks.slice(0, 5).map((track) => (
                                                    <ItemCard key={track.id} item={track} provider={track.provider}/>
                                                ))}
                                                {soundcloudTracks.length > 5 && (
                                                    <button 
                                                        onClick={() => setActiveTab('soundcloud')}
                                                        className="text-accentPrimary hover:underline text-sm"
                                                    >
                                                        Show all {soundcloudTracks.length} SoundCloud results
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {activeTab === 'spotify' && spotifyTracks.map((track) => (
                                    <ItemCard key={track.id} item={track} provider={track.provider}/>
                                ))}
                                
                                {activeTab === 'soundcloud' && soundcloudTracks.map((track) => (
                                    <ItemCard key={track.id} item={track} provider={track.provider}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Queue sidebar - visible on larger screens, toggleable on mobile */}
                <div className={`${showQueue ? 'block' : 'hidden md:block'} md:w-1/3 bg-gray-900 rounded-lg p-4`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Queue</h2>
                        <button 
                            className="md:hidden text-gray-400"
                            onClick={toggleQueueDisplay}
                        >
                            Hide
                        </button>
                    </div>
                    <QueueManager />
                </div>
            </div>
            
            {/* Mobile queue button - only visible when queue is hidden */}
            <div className="md:hidden fixed bottom-24 right-4">
                {!showQueue && (
                    <button 
                        onClick={toggleQueueDisplay}
                        className="bg-accentPrimary text-white p-3 rounded-full shadow-lg flex items-center gap-2"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Queue
                    </button>
                )}
            </div>
            
            {/* Now playing bar - fixed at bottom, only visible when playing */}
            {currentTrack && (
                <div className="fixed bottom-20 left-0 right-0 bg-gray-900 p-3 flex items-center justify-between md:hidden">
                    <div className="flex items-center gap-3">
                        <img 
                            src={currentTrack.imageUrl || '/default-album-art.jpg'} 
                            alt={currentTrack.title} 
                            className="w-10 h-10 object-cover rounded"
                        />
                        <div className="truncate">
                            <p className="font-medium text-sm truncate">{currentTrack.title}</p>
                            <p className="text-xs text-gray-400 truncate">
                                {currentTrack.artists[0]?.name}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={togglePlayPause}
                        className="bg-accentPrimary rounded-full p-2"
                    >
                        {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4H6V20H10V4Z" fill="currentColor" />
                                <path d="M18 4H14V20H18V4Z" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 4L19 12L5 20V4Z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;