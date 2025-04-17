import React, { useState } from 'react';
import { useFavoriteContext } from "../contexts/favoriteContext";
import ItemCard from "../components/search/ItemCard";
import { Link } from 'react-router-dom';

// Logo imports
import SpotifyIcon from '../assets/spotify/Icon.svg';
import SoundcloudIcon from '../assets/soundcloud/Icon.svg';
import SearchFilter from '../components/search/SearchFilter';

const FavoritesPage: React.FC = (): JSX.Element => {
    const { spotifyFavoriteTracks, soundcloudFavoriteTracks } = useFavoriteContext();
    const [activeTab, setActiveTab] = useState<'all' | 'spotify' | 'soundcloud'>('all');
    
    const hasFavorites = spotifyFavoriteTracks.length > 0 || soundcloudFavoriteTracks.length > 0;

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Favorites</h1>
                <p className="text-gray-400">All your favorite tracks in one place</p>
            </div>

            {/* Tabs for filtering */}
            <div className="mb-6 border-b border-gray-700">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`py-2 px-4 ${activeTab === 'all' ? 'border-b-2 border-accentPrimary text-white' : 'text-gray-400'}`}
                    >
                        All Favorites
                    </button>
                    <button
                        onClick={() => setActiveTab('spotify')}
                        className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'spotify' ? 'border-b-2 border-accentPrimary text-white' : 'text-gray-400'}`}
                    >
                        <img src={SpotifyIcon} alt="Spotify" className="w-4 h-4" />
                        Spotify {spotifyFavoriteTracks.length > 0 && `(${spotifyFavoriteTracks.length})`}
                    </button>
                    <button
                        onClick={() => setActiveTab('soundcloud')}
                        className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'soundcloud' ? 'border-b-2 border-accentPrimary text-white' : 'text-gray-400'}`}
                    >
                        <img src={SoundcloudIcon} alt="SoundCloud" className="w-4 h-4" />
                        SoundCloud {soundcloudFavoriteTracks.length > 0 && `(${soundcloudFavoriteTracks.length})`}
                    </button>
                    <SearchFilter items={spotifyFavoriteTracks} />
                </div>
            </div>

            {/* Favorites content */}
            <div className="space-y-3">
                {!hasFavorites ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">No Favorites Yet</h2>
                        <p className="text-gray-400 max-w-md mb-6">
                            Start exploring and add songs to your favorites by clicking the heart icon.
                        </p>
                        <Link to="/home" className="inline-block px-6 py-2 bg-accentPrimary text-white rounded-full text-center">
                            Explore Music
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                        {activeTab === 'all' && (
                            <>
                                {spotifyFavoriteTracks.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                                            <img src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />
                                            Spotify Favorites
                                        </h2>
                                        <div className="space-y-2">
                                            {spotifyFavoriteTracks.map((track) => (
                                                <ItemCard key={track.id} item={track} provider="spotify" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {soundcloudFavoriteTracks.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                                            <img src={SoundcloudIcon} alt="SoundCloud" className="w-5 h-5" />
                                            SoundCloud Favorites
                                        </h2>
                                        <div className="space-y-2">
                                            {soundcloudFavoriteTracks.map((track) => (
                                                <ItemCard key={track.id} item={track} provider="soundcloud" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {activeTab === 'spotify' && (
                            <div className="space-y-2">
                                {spotifyFavoriteTracks.length > 0 ? (
                                    spotifyFavoriteTracks.map((track) => (
                                        <ItemCard key={track.id} item={track} provider="spotify" />
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400">No Spotify favorites yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'soundcloud' && (
                            <div className="space-y-2">
                                {soundcloudFavoriteTracks.length > 0 ? (
                                    soundcloudFavoriteTracks.map((track) => (
                                        <ItemCard key={track.id} item={track} provider="soundcloud" />
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400">No SoundCloud favorites yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;