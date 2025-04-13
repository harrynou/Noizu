import React, { useState } from 'react';
// import { useAuth } from "../contexts/authContext";

// Import any necessary images
import SpotifyIcon from '../assets/spotify/Icon.svg';
import SoundcloudIcon from '../assets/soundcloud/Icon.svg';

// Placeholder types - you'll replace these with your actual types
interface Playlist {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    trackCount: number;
    provider: 'spotify' | 'soundcloud' | 'custom';
    isPublic: boolean;
}

// Mock data - replace with your actual data fetching logic
const mockPlaylists: Playlist[] = [
    {
        id: '1',
        name: 'Workout Mix',
        description: 'High energy tracks for the gym',
        imageUrl: 'https://via.placeholder.com/200',
        trackCount: 12,
        provider: 'spotify',
        isPublic: true
    },
    {
        id: '2',
        name: 'Chill Vibes',
        description: 'Relaxing tracks for unwinding',
        imageUrl: 'https://via.placeholder.com/200',
        trackCount: 18,
        provider: 'soundcloud',
        isPublic: true
    },
    {
        id: '3',
        name: 'Custom Mix',
        description: 'My own curated mix',
        imageUrl: 'https://via.placeholder.com/200',
        trackCount: 8,
        provider: 'custom',
        isPublic: false
    }
];

const PlaylistsPage: React.FC = (): JSX.Element => {
    // const { isAuthenticated } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
    const [activeFilter, setActiveFilter] = useState<'all' | 'spotify' | 'soundcloud' | 'custom'>('all');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');

    // Filter playlists based on active filter
    const filteredPlaylists = playlists.filter(playlist => 
        activeFilter === 'all' || playlist.provider === activeFilter
    );

    // Placeholder for create playlist functionality
    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically call your API to create a new playlist
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name: newPlaylistName,
            description: '',
            imageUrl: 'https://via.placeholder.com/200',
            trackCount: 0,
            provider: 'custom',
            isPublic: false
        };
        
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
        setShowCreateModal(false);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Playlists</h1>
                    <p className="text-gray-400">Organize and enjoy your music collections</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-accentPrimary text-white rounded-full flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Playlist
                </button>
            </div>

            {/* Filter buttons */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                        activeFilter === 'all' 
                            ? 'bg-accentPrimary text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    All Playlists
                </button>
                <button
                    onClick={() => setActiveFilter('spotify')}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${
                        activeFilter === 'spotify' 
                            ? 'bg-accentPrimary text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <img src={SpotifyIcon} alt="Spotify" className="w-4 h-4" />
                    Spotify
                </button>
                <button
                    onClick={() => setActiveFilter('soundcloud')}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${
                        activeFilter === 'soundcloud' 
                            ? 'bg-accentPrimary text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <img src={SoundcloudIcon} alt="SoundCloud" className="w-4 h-4" />
                    SoundCloud
                </button>
                <button
                    onClick={() => setActiveFilter('custom')}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${
                        activeFilter === 'custom' 
                            ? 'bg-accentPrimary text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    My Playlists
                </button>
            </div>

            {/* Playlists grid */}
            {filteredPlaylists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPlaylists.map((playlist) => (
                        <div 
                            key={playlist.id} 
                            className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105 cursor-pointer"
                            onClick={() => {
                                // Navigate to playlist detail page
                                console.log(`Navigate to playlist ${playlist.id}`);
                            }}
                        >
                            <div className="relative pb-[100%]">
                                <img 
                                    src={playlist.imageUrl || 'https://via.placeholder.com/200'} 
                                    alt={playlist.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <div className="flex items-center gap-2">
                                        {playlist.provider === 'spotify' && (
                                            <img src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />
                                        )}
                                        {playlist.provider === 'soundcloud' && (
                                            <img src={SoundcloudIcon} alt="SoundCloud" className="w-5 h-5" />
                                        )}
                                        {playlist.provider === 'custom' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18V5l12-2v13"></path>
                                                <circle cx="6" cy="18" r="3"></circle>
                                                <circle cx="18" cy="16" r="3"></circle>
                                            </svg>
                                        )}
                                        <span className="text-sm text-gray-300">{playlist.trackCount} tracks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold truncate">{playlist.name}</h3>
                                {playlist.description && (
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{playlist.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Playlists Found</h2>
                    <p className="text-gray-400 max-w-md mb-6">
                        {activeFilter === 'all' 
                            ? "You don't have any playlists yet. Create your first playlist to get started!"
                            : `You don't have any ${activeFilter} playlists yet.`
                        }
                    </p>
                    <button 
                        onClick={() => setShowCreateModal(true)} 
                        className="px-6 py-2 bg-accentPrimary text-white rounded-full"
                    >
                        Create Playlist
                    </button>
                </div>
            )}

            {/* Create playlist modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
                        <form onSubmit={handleCreatePlaylist}>
                            <div className="mb-4">
                                <label htmlFor="playlist-name" className="block text-sm font-medium mb-1">
                                    Playlist Name
                                </label>
                                <input
                                    type="text"
                                    id="playlist-name"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    placeholder="My Awesome Playlist"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="playlist-desc" className="block text-sm font-medium mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="playlist-desc"
                                    placeholder="Describe your playlist"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Privacy
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="privacy" value="public" className="mr-2" />
                                        Public
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="privacy" value="private" className="mr-2" defaultChecked />
                                        Private
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-accentPrimary text-white rounded hover:bg-opacity-90"
                                    disabled={!newPlaylistName.trim()}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistsPage;