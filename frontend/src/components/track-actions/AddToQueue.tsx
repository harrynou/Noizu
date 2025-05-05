import React, { useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { useMusicContext } from "../../contexts/musicPlayerContext";
import AddToQueueSVG from '../../assets/AddToQueue.svg';

interface AddToQueueProp {
    track: Track;
}

const AddToQueueAction = ({ track }: AddToQueueProp): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const { addToQueue, queue } = useMusicContext();
    const [isAdded, setIsAdded] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    
    const isFreeToPlay = track.provider === 'soundcloud';
    const isInQueue = queue.some(queuedTrack => queuedTrack.id === track.id && queuedTrack.provider === track.provider);

    // Only show the button if the user is authenticated or track is free to play
    const showButton = isAuthenticated || isFreeToPlay;
    
    if (!showButton) {
        return <div className="inline-flex items-center justify-center h-8 w-8"></div>;
    }

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (isInQueue) return;
        
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
        <div className="inline-flex items-center justify-center h-8 w-8 relative">
            <button
                onClick={handleAddToQueue}
                disabled={isInQueue}
                className={`flex items-center justify-center w-6 h-6 transition-transform ${isInQueue ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                aria-label={isInQueue ? "Already in queue" : "Add to queue"}
                title={isInQueue ? "Already in queue" : "Add to queue"}
            >
                <img 
                    className="w-full h-full" 
                    src={AddToQueueSVG} 
                    alt="Add to queue" 
                />
            </button>
            
            {/* Success/already in queue tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black bg-opacity-80 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity duration-200">
                    {isAdded ? "Added to queue" : isInQueue ? "Already in queue" : ""}
                </div>
            )}
        </div>
    );
};

export default React.memo(AddToQueueAction);