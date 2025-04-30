import React, { useState, useEffect, useRef } from 'react';
import { getPlaylists, createPlaylist, deletePlaylist, Playlist } from '../../services/api';
import PlaylistCard from '../../components/playlists/PlaylistCard';
import { useNavigate } from 'react-router-dom';

const PlaylistsPage = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');
    const [playlistCover, setPlaylistCover] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Fetch playlists on component mount
    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const fetchedPlaylists = await getPlaylists();
            setPlaylists(fetchedPlaylists);
            setError(null);
        } catch (err) {
            console.error('Error fetching playlists:', err);
            setError('Failed to load playlists. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;
        
        try {
            setIsSubmitting(true);
            const newPlaylist = await createPlaylist(newPlaylistName, playlistCover || undefined);
            setPlaylists(prev => [...prev, newPlaylist]);
            setNewPlaylistName('');
            setPlaylistCover(null);
            setShowCreateModal(false);
            
            // Navigate to the new playlist
            navigate(`/playlists/${newPlaylist.playlist_id}`);
        } catch (err) {
            console.error('Error creating playlist:', err);
            setError('Failed to create playlist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePlaylist = async (playlistId: number) => {
        try {
            await deletePlaylist(playlistId);
            setPlaylists(prev => prev.filter(p => p.playlist_id !== playlistId));
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting playlist:', err);
            setError('Failed to delete playlist. Please try again.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setPlaylistCover(files[0]);
        }
    };

    const resetModal = () => {
        setNewPlaylistName('');
        setPlaylistCover(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setShowCreateModal(false);
    };

    // Get preview URL for selected file
    const getImagePreview = () => {
        if (playlistCover) {
            return URL.createObjectURL(playlistCover);
        }
        return null;
    };

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
            {/* Header section */}
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
            
            {/* Error message */}
            {error && (
                <div className="bg-red-800 bg-opacity-30 border border-red-700 text-white px-4 py-3 rounded mb-6">
                    <p>{error}</p>
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accentPrimary"></div>
                </div>
            ) : (
                // Playlists grid
                playlists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {playlists.map((playlist) => (
                            <div key={playlist.playlist_id} className="relative group">
                                <PlaylistCard 
                                    playlist={{
                                        ...playlist,
                                        // Add track_count when available from API
                                        track_count: undefined
                                    }} 
                                />
                                
                                {/* Delete button overlay */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteConfirm(playlist.playlist_id);
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Delete playlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                                
                                {/* Delete confirmation overlay */}
                                {showDeleteConfirm === playlist.playlist_id && (
                                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex flex-col items-center justify-center p-4">
                                        <p className="text-white text-center mb-4">Are you sure you want to delete "{playlist.name}"?</p>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowDeleteConfirm(null);
                                                }}
                                                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePlaylist(playlist.playlist_id);
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty state
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
                            You don't have any playlists yet. Create your first playlist to get started!
                        </p>
                        <button 
                            onClick={() => setShowCreateModal(true)} 
                            className="px-6 py-2 bg-accentPrimary text-white rounded-full"
                        >
                            Create Playlist
                        </button>
                    </div>
                )
            )}

            {/* Create playlist modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => resetModal()}>
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
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
                                    placeholder="My Playlist Name"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary"
                                    required
                                />
                            </div>
                            
                            {/* Playlist cover image upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Playlist Cover (Optional)
                                </label>
                                <div className="flex items-center gap-4">
                                    {/* Preview image */}
                                    <div className="w-24 h-24 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center border border-gray-600">
                                        {getImagePreview() ? (
                                            <img 
                                                src={getImagePreview() || ''} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            id="playlist-cover"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                                        >
                                            Choose Image
                                        </button>
                                        {playlistCover && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPlaylistCover(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="ml-2 px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP (max 5MB)</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                                    onClick={() => resetModal()}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-accentPrimary text-white rounded hover:bg-opacity-90 flex items-center"
                                    disabled={!newPlaylistName.trim() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create'
                                    )}
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