import React, { ReactEventHandler, useEffect, useRef, useState, useCallback} from "react";
import formatDuration from '../../utils/formatDuration';
import { usePlayerState } from "../../contexts/playerStateContext";

interface ProgressBarProps {
    duration: number | null;
}

const ProgressBar = ({duration}: ProgressBarProps): JSX.Element => {
    const [isDragging, setIsDragging] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState(0);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const dragPositionRef = useRef<number | null>(null);
    const { seek, currentPosition } = usePlayerState();

    const durationFormatted = formatDuration(duration); 
    let positionFormatted = isDragging ? formatDuration(dragPositionRef.current) : formatDuration(currentPosition);
    const progressPercentage = duration ? Math.min(((dragPositionRef.current ?? currentPosition) / duration) * 100, 100) : 0;

    useEffect(() => {
        positionFormatted = isDragging ? formatDuration(dragPositionRef.current) : formatDuration(currentPosition);
    }, [currentPosition]);

    const updateDragPosition = useCallback((clientX: number) => {
        if (!progressBarRef.current || !duration) return;
        
        const rect = progressBarRef.current.getBoundingClientRect();
        const newProgress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newPosition = newProgress * duration;
        
        dragPositionRef.current = newPosition;

        
        // Update tooltip position
        if (tooltipRef.current) {
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const maxLeft = rect.width - tooltipWidth/2;
            const minLeft = tooltipWidth/2;
            
            let tooltipLeft = clientX - rect.left;
            tooltipLeft = Math.min(Math.max(tooltipLeft, minLeft), maxLeft);
            
            tooltipRef.current.style.left = `${tooltipLeft}px`;
        }
    }, [duration]);

    const handlePointerDown: ReactEventHandler = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!duration || !progressBarRef.current) return;
        setIsDragging(true);
        rectRef.current = progressBarRef.current.getBoundingClientRect(); 
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
        updateDragPosition(e.clientX);
    }, [duration, updateDragPosition]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        updateDragPosition(e.clientX);
    }, [updateDragPosition]);

    const handlePointerUp =  useCallback(() => {
        if (dragPositionRef.current !== null) {
            seek(dragPositionRef.current); 
        }
        setIsDragging(false);
        setShowTooltip(false);
        dragPositionRef.current = null;
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
    },[seek,handlePointerMove]);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            setShowTooltip(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !duration) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const mousePosition = (e.clientX - rect.left) / rect.width;
        setTooltipPosition(mousePosition * 100);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);


    const getTooltipTime = () => {
        if (!duration) return "0:00";
        const hoverPosition = (tooltipPosition / 100) * duration;
        return formatDuration(hoverPosition);
    };


    return (
    <div className='flex items-center space-x-4 text-sm'>
        <div className="w-[40px] text-right">{positionFormatted}</div>
        <div 
            ref={progressBarRef}
            className="relative w-full h-[6px] cursor-pointer group"
            onPointerDown={handlePointerDown} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            aria-label="Audio playback progress"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration || 100}
            aria-valuenow={currentPosition}
            aria-valuetext={`${positionFormatted} of ${durationFormatted}`}
            tabIndex={0}
            >

            {/* Progress Bar Background */}
            <div className="absolute inset-0 bg-gray-700 rounded-full"></div>

            {/* Current Progress */}
            <div 
                className='absolute top-0 left-0 h-full bg-secondary rounded'
                style={{ width: `${progressPercentage}%`}}>
            </div>
            {/* Draggable handle */}
            <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full -ml-1.5 transform transition-opacity ${
                        isDragging || showTooltip ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{ left: `${progressPercentage}%` }}
                ></div>
            {/* Tooltip */}
            {showTooltip && (
            <div ref={tooltipRef}
            className="absolute -top-8 tranform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded pointer-events-none"
            style={{ left: `${tooltipPosition}%` }}>
                {getTooltipTime()}
            </div>
        )}
        </div>
        <div className="w-[40px] text-right">{durationFormatted}</div>
    </div>
    )
}

export default React.memo(ProgressBar);