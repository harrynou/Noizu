import { useState, useRef, ReactEventHandler, useEffect } from "react";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";
import { setUserVolume } from "../../services/api";
import {useAuth} from '../../contexts/authContext'

const VolumeMixer: React.FC = (): JSX.Element => {
    const {setNewVolume, currentVolume} = useMusicPlayer();
    const volumeMixerRef = useRef<HTMLDivElement | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<number>(50);
    const volumePercentage = Math.max(0, Math.min(100, dragPosition));
    const {isAuthenticated} = useAuth();
    const [isMuted, setIsMuted] = useState<boolean>(currentVolume === 0);
    const previousVolumeRef = useRef<number>(currentVolume || 0.5);

    // useEffect(() => {
    //     window.addEventListener('keydown', handleMKey);
    //     return () => {
    //         window.removeEventListener('keydown', handleMKey);
    //     }
    // })

    useEffect(() => {
        if (currentVolume !== null){
            setDragPosition(currentVolume * 100); // Convert to percentage
            setIsMuted(currentVolume === 0);
        }
    }, [currentVolume]);

    const handlePointerDown: ReactEventHandler = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!volumeMixerRef.current) return;
        setIsDragging(true);
        rectRef.current = volumeMixerRef.current.getBoundingClientRect();   
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        updateDragPosition(e.clientX);

    }

    const updateDragPosition = (clientX: number) => {

        if (!rectRef.current) return;
        const newProgress = Math.max(0, Math.min(1, (clientX - rectRef.current.left) / rectRef.current.width));
        const newVolume = newProgress * 100;
        if (newVolume === 0) {
            setIsMuted(true);
            if (currentVolume > 0) {
                previousVolumeRef.current = currentVolume; // Save the last known volume before mute
            }
        } else {
            setIsMuted(false);
        }
        setDragPosition(newVolume); 
        setNewVolume(newVolume / 100);

    };


    const handlePointerMove = (e: PointerEvent) => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(() => updateDragPosition(e.clientX));
    }

    const handlePointerUp = () => {
        setIsDragging(false);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        setDragPosition((latestDragPosition) => {
            if (isAuthenticated) setUserVolume(latestDragPosition / 100);
            return latestDragPosition;
        });
    };

    const handleMute = () => {
        if (!isMuted) {
            previousVolumeRef.current = currentVolume || 0.5; // Save last volume before mute
            setNewVolume(0);
        } else {
            setNewVolume(previousVolumeRef.current);
        }
        setIsMuted(!isMuted);
    };

    // const handleMKey = (event: KeyboardEvent) => {
    //     if (event.code === 'KeyM'){
    //         event.preventDefault();
    //         handleMute();
    //     }
    // }

    return (
        
        <div className="flex items-center space-x-2">
            {/* speaker icon */}
            <div onClick={handleMute} className="w-6">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                    <g>
                        <rect width="24" height="24" fill="none" />
                        <path d="M3 16V8H6L11 4V20L6 16H3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 9C13 9 15 9.5 15 12C15 14.5 13 15 13 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 7C15 7 18 7.83333 18 12C18 16.1667 15 17 15 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 5C17 5 21 6.16667 21 12C21 17.8333 17 19 17 19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        {isMuted ? <path d="M4 4L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/> : null}
                    </g>
                </svg>
            </div>
            {/* volume mixer */}
            <div ref={volumeMixerRef} className="relative w-full h-[6px] cursor-pointer" onPointerDown={handlePointerDown}>
                <svg className=" w-full h-full text-gray-700"  fill="none" viewBox="0 0 150 10"><path stroke="currentColor" strokeLinecap="round" strokeWidth="6" d="M0 5h145"/></svg>
                <div
                    className={"absolute top-0 left-0 bg-textPrimary rounded"}
                    style={{ width: `${volumePercentage}%`, height: '6px' }}>
                </div>
            </div>
        </div>

    )
}

export default VolumeMixer