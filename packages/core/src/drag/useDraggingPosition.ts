import { useRef, useState } from 'react';
import * as React from 'react';
import { DraggingPosition, HoveringPosition, TreeItem } from '../types';
import {
  computeItemHeight,
  isOutsideOfContainer,
  computeItemHeightArray,
} from '../controlledEnvironment/layoutUtils';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useStableHandler } from '../useStableHandler';
import { DraggingPositionEvaluation } from './DraggingPositionEvaluation';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';

export const useDraggingPosition = () => {
  const dragCode = useRef('initial');
  const [draggingItems, setDraggingItems] = useState<TreeItem[] | undefined>(
    undefined
  );
  const itemHeight = useRef(0);
  const itemsHeightArray = useRef([0]);
  const env = useTreeEnvironment();
  const getParentOfLinearItem = useGetGetParentOfLinearItem();

  const isNewDragPosition = useStableHandler(
    (
      e: DragEvent,
      treeId: string,
      hoveringPosition: HoveringPosition | undefined
    ) => {
      if (!hoveringPosition) {
        return false;
      }
      const { offset, linearIndex } = hoveringPosition;

      const newDragCode = `${treeId}__${linearIndex}__${offset ?? ''}__${
        hoveringPosition.indentation
      }`;
      if (newDragCode !== dragCode.current) {
        dragCode.current = newDragCode;
        return true;
      }

      return false;
    }
  );

  /**
   * Returns undefined for invalid drop targets, like outside the tree.
   */
  const getHoveringPosition = useStableHandler(
    (
      e: DragEvent,
      treeId: string,
      containerRef: React.MutableRefObject<HTMLElement | undefined>
    ): HoveringPosition | undefined => {
      if (!containerRef.current) {
        return undefined;
      }

      itemsHeightArray.current = computeItemHeightArray(treeId);

      const treeBb = containerRef.current.getBoundingClientRect();

      if (isOutsideOfContainer(e, treeBb)) {
        return undefined;
      }

      const treeLinearItems = env.linearItems[treeId];

      if (treeLinearItems.length === 0) {
        return {
          linearIndex: 0,
          offset: 'bottom',
          indentation: 0,
        };
      }

      // Map the pointer's vertical position onto a fractional "linear index"
      // using each item's *measured* height, so dragging tracks correctly even
      // when items have different sizes. The integer part is the item index and
      // the fractional part is how far the pointer is into that item (0 = top,
      // approaching 1 = bottom).
      const itemHeights = itemsHeightArray.current;
      const clientYRelativeToTreeTop = e.clientY - treeBb.top;

      let hoveringPosition = 0;
      let cumulativeHeight = 0;
      let matchedItem = false;

      for (let i = 0; i < itemHeights.length; i += 1) {
        const height = itemHeights[i] || 0;
        const withinItem =
          height > 0 && clientYRelativeToTreeTop < cumulativeHeight + height;
        if (withinItem) {
          hoveringPosition =
            i + (clientYRelativeToTreeTop - cumulativeHeight) / height;
          matchedItem = true;
          break;
        }
        cumulativeHeight += height;
      }

      if (!matchedItem) {
        // Pointer is below the last item (e.g. dragging into empty space at the
        // bottom of the tree). Position it past the end so the "drop at the very
        // bottom" detection below resolves to a bottom offset.
        hoveringPosition = treeLinearItems.length;
      }

      const linearIndex = Math.min(
        Math.max(0, Math.floor(hoveringPosition)),
        treeLinearItems.length - 1
      );

      const targetLinearItem = treeLinearItems[linearIndex];
      const targetItem = env.items[targetLinearItem.item];

      const indentation = !env.renderDepthOffset
        ? undefined
        : Math.max(
            Math.floor((e.clientX - treeBb.left) / env.renderDepthOffset),
            0
          );

      let offset: 'top' | 'bottom' | undefined;

      const lineThreshold = !env.canReorderItems
        ? 0
        : (targetItem?.isFolder && env.canDropOnFolder) ||
          env.canDropOnNonFolder
        ? 0.2
        : 0.5;

      if (hoveringPosition - 0.5 >= treeLinearItems.length - 1) {
        // very bottom, always use offset "bottom"
        offset = 'bottom';
      } else if (hoveringPosition % 1 < lineThreshold) {
        offset = 'top';
      } else if (hoveringPosition % 1 > 1 - lineThreshold) {
        offset = 'bottom';
      }

      return { linearIndex, offset, indentation };
    }
  );

  // returning undefined means calling onDragAtPosition(undefined), returning a dropposition means calling onPerformDrag(dropposition)
  // TODO old function sometimes returned undefined when old state could be kept; is it okay to also return undefined to enter invalid drop state here? e.g. !this.draggingItems, !canDragAndDrop...
  const getDraggingPosition = useStableHandler(
    (
      e: DragEvent,
      treeId: string,
      containerRef: React.MutableRefObject<HTMLElement | undefined>
    ): DraggingPosition | 'invalid' | undefined => {
      const hoveringPosition = getHoveringPosition(e, treeId, containerRef);

      if (!isNewDragPosition(e, treeId, hoveringPosition)) {
        return undefined;
      }

      if (
        !draggingItems ||
        !env.canDragAndDrop ||
        !hoveringPosition ||
        e.clientX < 0 ||
        e.clientY < 0
      ) {
        return 'invalid';
      }

      return new DraggingPositionEvaluation(
        env,
        e,
        treeId,
        hoveringPosition,
        draggingItems,
        getParentOfLinearItem
      ).getDraggingPosition();
    }
  );

  const initiateDraggingPosition = useStableHandler(
    (treeId: string, items: TreeItem[]) => {
      setDraggingItems(items);
      dragCode.current = 'initial';
      itemHeight.current = computeItemHeight(treeId);
      itemsHeightArray.current = computeItemHeightArray(treeId);
    }
  );

  const resetDraggingPosition = useStableHandler(() => {
    setDraggingItems(undefined);
    dragCode.current = 'initial';
    itemHeight.current = 0;
    itemsHeightArray.current = [0];
  });

  return {
    initiateDraggingPosition,
    resetDraggingPosition,
    draggingItems,
    getDraggingPosition,
    itemHeight,
    itemsHeightArray,
  };
};
