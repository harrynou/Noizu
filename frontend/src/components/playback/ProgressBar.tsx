import React, { ReactEventHandler, useRef, useState } from "react";
import msToMinutesSeconds from '../../utils/msToMinutesSeconds';
import { useMusicPlayer } from "../../contexts/musicPlayerContext";

interface ProgressBarProps {
    duration: number | null;
    position: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({duration, position}): JSX.Element => {
    const [isDragging, setIsDragging] = useState(false);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const dragPositionRef = useRef<number | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const { seek } = useMusicPlayer()

    const durationFormatted = msToMinutesSeconds(duration); 
    const positionFormatted = isDragging ? msToMinutesSeconds(dragPositionRef.current) : msToMinutesSeconds(position);
    const progressPercentage = duration ? ((dragPositionRef.current ?? position) / duration) * 100 : 0;

    const handlePointerDown: ReactEventHandler = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!duration || !progressBarRef.current) return;
        setIsDragging(true);
        rectRef.current = progressBarRef.current.getBoundingClientRect(); 
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
        updateDragPosition(e.clientX);

    }
    const handlePointerMove = (e: PointerEvent) => {
        updateDragPosition(e.clientX);
    };

    const updateDragPosition = (clientX: number) => {
        if (!rectRef.current || !duration) return;

        const newProgress = Math.max(0, Math.min(1, (clientX - rectRef.current.left) / rectRef.current.width));
        const newPosition = newProgress * duration;
        dragPositionRef.current = newPosition;
    };

    const handlePointerUp = () => {
        if (dragPositionRef.current !== null) {
            seek(dragPositionRef.current); 
        }

        setIsDragging(false);
        dragPositionRef.current = null;

        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
    };

    return (
    <div className='flex items-center space-x-4 text-sm'>
        <div className="w-[40px] text-right">{positionFormatted}</div>
        <div ref={progressBarRef} className="relative w-full h-[6px] cursor-pointer" onPointerDown={handlePointerDown}>
            <svg className=" w-full h-full text-gray-700" fill="none" viewBox="18 0 800 12"><path stroke="currentColor" strokeLinecap="round" strokeWidth="6" d="M6 6h824"/></svg>
            <div 
                className='absolute top-0 left-0 bg-secondary rounded'
                style={{ width: `${progressPercentage}%`, height: '6px' }}>
            </div>
        </div>
        <div className="w-[40px] text-right">{durationFormatted}</div>
    </div>
    )
}

export default React.memo(ProgressBar);