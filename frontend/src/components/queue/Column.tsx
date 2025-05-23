import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ItemCard from "./itemCard";

interface ColumnProps {
  queue: Track[];
}

export const Column = ({ queue }: ColumnProps) => {
  return (
    <div>
      <SortableContext items={queue} strategy={verticalListSortingStrategy}>
        {queue.map((track, index) => (
          <ItemCard track={track} key={`${track.id}-${track.provider}`} id={index} />
        ))}
      </SortableContext>
    </div>
  );
};
