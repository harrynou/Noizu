import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMusicPlayer } from '../../contexts/musicPlayerContext';

const QueueManager: React.FC = () => {
    const { queue, reorderQueue, selectTrackToPlay, currentTrack } = useMusicPlayer();

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        reorderQueue(result.source.index, result.destination.index);
    };
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Queue</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="queue">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className="mt-2 space-y-2">
                            {queue.map((track, index) => (
                                <Draggable key={track.id} draggableId={String(track.id)} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`flex items-center justify-between gap-4 p-2 rounded ${
                                                currentTrack?.id === track.id ? 'bg-secondary text-textSecondary' : 'bg-primary text-textPrimary'
                                            }`}
                                            onClick={() => selectTrackToPlay(index)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={track.imageUrl}
                                                    alt={track.title}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">{track.title}</p>
                                                    <div className="flex flex-wrap text-xs">
                                                        {track.artists.map((artist:any) => (
                                                            <a key={artist.name} href={artist.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block whitespace-nowrap hover:underline hover:text-accent">{artist.name}</a> 
                                                            )).reduce((prev:any, curr:any, index:number) => [prev, <span key={`comma-${index}`}>, </span>, curr])}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default QueueManager;
