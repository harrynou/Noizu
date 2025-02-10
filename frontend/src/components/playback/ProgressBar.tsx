import { useEffect } from "react";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";
import msToMinutesSeconds from '../../utils/msToMinutesSeconds'

interface ProgressBarProps {
    duration: number | null;
    position: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({duration, position}): JSX.Element => {
    const {currentTrack} = useMusicPlayer()
    let durationFormated = msToMinutesSeconds(duration); 
    let positionFormated = msToMinutesSeconds(position);
    useEffect(() => {
        positionFormated = msToMinutesSeconds(position);
}, [position, currentTrack]);


    return (
    <div className='flex gap-2'>
        <div>{positionFormated}</div>
        <div className="relative w-full h-2 bg-gray-200 rounded">
            <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded progress-bar"></div>
        </div>
        <div>{durationFormated}</div>
    </div>
    )
}

export default ProgressBar