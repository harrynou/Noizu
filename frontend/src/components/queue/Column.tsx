import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ItemCard from "./ItemCard";

interface ColumnProps {
  queue: Track[];
}

export const Column = ({ queue }: ColumnProps) => {
  // FIXED: Create array of indices for sortable context
  // This ensures each item has a unique, stable identifier
  const sortableIds = queue.map((_, index) => index);

  return (
    <div className="space-y-2">
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        {queue.map((track, index) => (
          <ItemCard
            track={track}
            key={`${track.id}-${track.provider}-${index}`} // Stable key that includes index
            id={index} // Pass index as ID for drag and drop
          />
        ))}
      </SortableContext>
    </div>
  );
};
