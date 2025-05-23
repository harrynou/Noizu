import { useState, useRef, useEffect } from "react";
import { closestCorners, DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";
import { Column } from "./Column";

/**
 * QueueManager component displays the current playback queue with drag-and-drop functionality
 * and dropdown options for track actions like favoriting and adding to playlists.
 */
const QueueManager = (): JSX.Element => {
  const { queue, currentTrackIndex, toggleQueueManager, reorderQueue, clearQueue } =
    useMusicPlayer();

  const getTrackId = (id: UniqueIdentifier) =>
    queue.findIndex((track) => {
      track.id === id;
    });

  // Handle track reordering after drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const startIndex = getTrackId(active.id);
    const endIndex = getTrackId(over.id);
    reorderQueue(startIndex, endIndex);
  };

  return (
    <div className="w-80 md:w-96 h-full bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden shadow-lg transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-bold text-lg text-white">Queue</h2>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-gray-400 hover:text-white text-sm p-2 transition-colors"
              title="Clear queue">
              Clear
            </button>
          )}
          <button
            onClick={toggleQueueManager}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close queue"
            title="Close queue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Queue Content with Drag and Drop */}
      <div className="flex-1 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-gray-600">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <p className="font-medium mb-2">Your queue is empty</p>
            <p className="text-sm">
              Add songs to your queue by clicking the "Add to queue" button on any track.
            </p>
          </div>
        ) : (
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <Column queue={queue}></Column>
          </DndContext>
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="p-3 border-t border-gray-700 text-xs text-gray-500">
        <p className="flex items-center justify-center gap-4">
          <span className="flex items-center">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 mr-1">Ctrl + Q</kbd>
            Toggle Queue
          </span>
          <span className="flex items-center">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 mr-1">Space</kbd>
            Play/Pause
          </span>
        </p>
      </div>
    </div>
  );
};

export default QueueManager;
