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
                                                currentTrack?.id === track.id ? 'bg-blue-100' : 'bg-gray-100'
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
                                                    <p className="text-sm text-gray-600">{track.artist}</p>
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
