import React from 'react';
import { useMusicPlayer } from '../../contexts/musicPlayerContext.tsx';
import pauseButton from '../../assets/pause-button.svg'
import playButton from '../../assets/play-button.svg'
import previousButton from '../../assets/previous-button.svg' 

const PlaybackControls: React.FC = () => {
    const { currentTrack, isPlaying, togglePlayPause, playNextTrack, playPreviousTrack } = useMusicPlayer();
    return (
        
        <div className="relative flex items-center bg-primary h-16 p-12 my-4 text-neutral">
            {/* Left Side Track Info */}
            <div className='absolute left-2'>
            {currentTrack ? (
                <div className='flex items-center gap-4'>
                <div>
                    <img src={currentTrack.imageUrl} className="w-16 h-16 object-cover rounded-sm"/>
                </div>
                <div className="flex flex-col items-start">
                    <p>{currentTrack.title}</p>
                    <div className="flex flex-wrap text-xs">
                {currentTrack.artists.map((artist:any) => (
                    <a key={artist.name} href={artist.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block whitespace-nowrap hover:underline hover:text-accent">{artist.name}</a> 
                )).reduce((prev:any, curr:any, index:number) => [prev, <span key={`comma-${index}`}>, </span>, curr])}
                </div>                </div>
            </div>
            ) : (
                <div></div>
            )}
            </div>
            {/* Middle */}
            <div className='absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2'>
                {/* Playback Controls */}
                <div className="flex items-center gap-5">
                    <a onClick={playPreviousTrack} className="w-6">
                        <img src={previousButton} />
                    </a>
                    <a onClick={togglePlayPause} className="">
                        <img src={isPlaying ? pauseButton : playButton} className='w-8'/>
                    </a>
                    <a onClick={playNextTrack} className="w-6">
                        <img src='nextButton' />
                    </a>
                </div>
                {/* Track Progress */}
                <div>
                    Track Progress
                </div>
            </div>
            {/* Right Side Options */}
            <div className='absolute right-2'>
                <div className='flex'>
                    
                </div>
            </div>
        </div>
    );
};


export default PlaybackControls;
