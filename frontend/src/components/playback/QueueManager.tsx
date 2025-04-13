import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useMusicPlayer } from '../../contexts/musicPlayerContext';

const QueueManager: React.FC = () => {
    const { queue, reorderQueue, selectTrackToPlay, currentTrack, removeFromQueue, isPlaying, togglePlayPause } = useMusicPlayer();
    const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        reorderQueue(result.source.index, result.destination.index);
    };

    const handleRemoveTrack = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromQueue(id);
    };

    const handleClearQueue = () => {
        setShowConfirmClear(false);
        // Clear all tracks except the currently playing one
        queue.forEach(track => {
            if (currentTrack && track.id !== currentTrack.id) {
                removeFromQueue(track.id);
            }
        });
    };

    const handleTrackClick = (index: number) => {
        if (currentTrack && currentTrack.id === queue[index].id) {
            togglePlayPause();
        } else {
            selectTrackToPlay(index);
        }
    };

    // Empty state
    if (queue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-4">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <h3 className="text-lg font-semibold mb-2">Your queue is empty</h3>
                <p className="text-gray-400 text-sm">Add tracks to your queue to start listening</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Queue ({queue.length})</h2>
                
                {queue.length > 1 && (
                    <div className="relative">
                        <button 
                            onClick={() => setShowConfirmClear(true)}
                            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                        >
                            Clear Queue
                        </button>
                        
                        {/* Confirmation modal */}
                        {showConfirmClear && (
                            <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-md shadow-lg p-3 z-10 w-48">
                                <p className="text-sm mb-2">Clear all tracks from queue?</p>
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => setShowConfirmClear(false)} 
                                        className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleClearQueue} 
                                        className="text-xs px-2 py-1 bg-red-600 hover:bg-red-500 rounded"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="queue">
                    {(provided) => (
                        <ul 
                            {...provided.droppableProps} 
                            ref={provided.innerRef} 
                            className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1"
                        >
                            {queue.map((track, index) => {
                                const isCurrentlyPlaying = currentTrack?.id === track.id;
                                
                                return (
                                    <Draggable key={`${track.id}-${index}`} draggableId={`${track.id}-${index}`} index={index}>
                                        {(provided, snapshot) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`flex items-center justify-between gap-2 p-2 rounded-md transition-all ${
                                                    snapshot.isDragging ? 'opacity-70' : 'opacity-100'
                                                } ${
                                                    isCurrentlyPlaying 
                                                        ? 'bg-gradient-to-r from-accentPrimary/30 to-gray-800 border-l-2 border-accentPrimary' 
                                                        : 'bg-gray-800 hover:bg-gray-700'
                                                }`}
                                                onClick={() => handleTrackClick(index)}
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="relative">
                                                        <img
                                                            src={track.imageUrl}
                                                            alt={track.title}
                                                            className="w-10 h-10 object-cover rounded"
                                                            loading="lazy"
                                                        />
                                                        {isCurrentlyPlaying && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                                                {isPlaying ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <rect x="6" y="4" width="4" height="16"></rect>
                                                                        <rect x="14" y="4" width="4" height="16"></rect>
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm truncate" title={track.title}>
                                                            {track.title}
                                                        </p>
                                                        <div className="flex flex-wrap text-xs text-gray-400">
                                                            {track.artists.slice(0, 1).map((artist: any) => (
                                                                <span key={artist.name} className="truncate" title={artist.name}>
                                                                    {artist.name}
                                                                </span>
                                                            ))}
                                                            {track.artists.length > 1 && (
                                                                <span className="truncate"> + {track.artists.length - 1} more</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Track actions */}
                                                <div className="flex items-center">
                                                    {/* Drag handle indicator */}
                                                    <div className="text-gray-500 mr-2 cursor-grab">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="9" cy="12" r="1"></circle>
                                                            <circle cx="9" cy="5" r="1"></circle>
                                                            <circle cx="9" cy="19" r="1"></circle>
                                                            <circle cx="15" cy="12" r="1"></circle>
                                                            <circle cx="15" cy="5" r="1"></circle>
                                                            <circle cx="15" cy="19" r="1"></circle>
                                                        </svg>
                                                    </div>
                                                    
                                                    {/* Remove button */}
                                                    <button
                                                        onClick={(e) => handleRemoveTrack(track.id, e)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        aria-label="Remove from queue"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            
            <div className="mt-4 pt-3 border-t border-gray-700 text-center text-xs text-gray-500">
                <p>Drag and drop to reorder tracks</p>
            </div>
        </div>
    );
};

export default React.memo(QueueManager);