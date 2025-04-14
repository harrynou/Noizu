import React, { useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";
import AddToQueueSVG from '../../assets/AddToQueue.svg';

interface AddToQueueProp {
    track: Track;
}

const AddToQueueAction: React.FC<AddToQueueProp> = ({ track }): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const { addToQueue, queue } = useMusicPlayer();
    const [isAdded, setIsAdded] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Check if the track is free to play (no auth required)
    const isFreeToPlay = track.provider === 'soundcloud';
    // Check if this track is already in the queue
    const isInQueue = queue.some(queuedTrack => queuedTrack.id === track.id && queuedTrack.provider === track.provider);

    // Only show the button if the user is authenticated or track is free to play
    const showButton = isAuthenticated || isFreeToPlay;
    
    if (!showButton) {
        return <div className="w-6"></div>; // Empty space placeholder for layout consistency
    }

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent parent click events
        
        if (isInQueue) return; // Prevent adding duplicates
        
        addToQueue(track);
        
        // Show added confirmation
        setIsAdded(true);
        setShowTooltip(true);
        
        // Hide tooltip after delay
        setTimeout(() => {
            setShowTooltip(false);
            setTimeout(() => setIsAdded(false), 300); // Reset added state after tooltip fades
        }, 1500);
    };

    return (
        <div className="relative">
            <button
                onClick={handleAddToQueue}
                disabled={isInQueue}
                className={`group transition-transform ${isInQueue ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                aria-label={isInQueue ? "Already in queue" : "Add to queue"}
                title={isInQueue ? "Already in queue" : "Add to queue"}
            >
                <img 
                    className="w-6 h-6 group-hover:opacity-80 transition-opacity" 
                    src={AddToQueueSVG} 
                    alt="Add to queue" 
                />
            </button>
            
            {/* Success/already in queue tooltip */}
            {showTooltip && (
                <div className="hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black bg-opacity-80 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity duration-200">
                    {isAdded ? "Added to queue" : isInQueue ? "Already in queue" : ""}
                </div>
            )}
        </div>
    );
};

export default React.memo(AddToQueueAction);