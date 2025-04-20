import React, { useState } from 'react';
// import { useAuth } from "../contexts/authContext";

//import SpotifyIcon from '../assets/spotify/Icon.svg';
// import SoundcloudIcon from '../assets/soundcloud/Icon.svg';

interface Playlist {
    id: string;
    name: string;
    imageUrl?: string;
    trackCount: number;
}

// Replace with Api Data
const mockPlaylists: Playlist[] = [
    {
        id: '1',
        name: 'Workout Mix',
        imageUrl: 'https://via.placeholder.com/200',
        trackCount: 12,
    },
];

const PlaylistsPage: React.FC = (): JSX.Element => {
    // const { isAuthenticated } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');

    // Placeholder for create playlist functionality
    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically call your API to create a new playlist
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name: newPlaylistName,
            imageUrl: 'https://via.placeholder.com/200',
            trackCount: 0,
        };
        
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
        setShowCreateModal(false);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
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

            {/* Playlists grid */}
            {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlists.map((playlist) => (
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
                                        <span className="text-sm text-gray-300">{playlist.trackCount} tracks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold truncate">{playlist.name}</h3>
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
                        {playlists.length === 0 
                            && "You don't have any playlists yet. Create your first playlist to get started!"
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