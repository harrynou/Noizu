import React from 'react';
import { useMusicPlayer } from '../../contexts/musicPlayerContext.tsx';

const PlaybackControls: React.FC = () => {
    const { currentTrack, isPlaying, togglePlayPause, playNextTrack, playPreviousTrack } = useMusicPlayer();
    return (
        <div className="p-4">
            {currentTrack ? (
                <>
                    <h2 className="text-lg font-bold">{currentTrack.title}</h2>
                    <p className="text-sm text-gray-600">{currentTrack.artist}</p>
                </>
            ) : (
                <p>No track is currently playing</p>
            )}

            <div className="flex gap-4 mt-4">
                <button onClick={playPreviousTrack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Previous
                </button>
                <button onClick={togglePlayPause} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={playNextTrack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Next
                </button>
            </div>
        </div>
    );
};


export default PlaybackControls;
