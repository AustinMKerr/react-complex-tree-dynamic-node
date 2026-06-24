import * as React from 'react';
import { HTMLProps } from 'react';
import { useTree } from './Tree';
import { useDragAndDrop } from '../drag/DragAndDropProvider';

export const DragBetweenLine: React.FC<{
  treeId: string;
}> = ({ treeId }) => {
  const { draggingPosition, itemsHeightArray } = useDragAndDrop();
  const { renderers } = useTree();

  const shouldDisplay =
    draggingPosition &&
    draggingPosition.targetType === 'between-items' &&
    draggingPosition.treeId === treeId;

  if (!shouldDisplay) {
    return null;
  }

  const lineProps: HTMLProps<any> = {
    onDragOver: e => e.preventDefault(), // Allow dropping
  };

  // Offset the line by the summed heights of the items above it, so it lands at
  // the correct spot even when items have different heights.
  const lineOffset = itemsHeightArray
    .slice(0, draggingPosition.linearIndex)
    .reduce((acc, height) => acc + height, 0);

  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        right: '0',
        top: `${lineOffset}px`,
      }}
    >
      {renderers.renderDragBetweenLine({
        draggingPosition: draggingPosition!,
        lineProps,
      })}
    </div>
  );
};
