import React, { ButtonHTMLAttributes, ExoticComponent, HTMLProps, InputHTMLAttributes, PropsWithChildren } from 'react';

export type TreeItemIndex = string | number;

export interface TreeItem<T = any> {
  index: TreeItemIndex;
  children?: Array<TreeItemIndex>;
  hasChildren?: boolean;
  // isChildrenLoading?: boolean;
  canMove?: boolean;
  canRename?: boolean;
  data: T;
}

export interface TreePosition {
  treeId: string;
  parent: TreeItemIndex;
  index: number;
}


export interface TreeItemActions {
  primaryAction: () => void;
  startRenamingItem: () => void;
  expandItem: () => void;
  collapseItem: () => void;
  toggleExpandedState: () => void;
  truncateItem: () => void;
  untruncateItem: () => void;
  toggleTruncatedState: () => void;
  selectItem: () => void;
  unselectItem: () => void;
  addToSelectedItems: () => void;
  startDragging: () => void;
  focusItem: () => void;
  // toggleSelectedState: () => void;
}

export interface TreeItemRenderFlags {
  isSelected?: boolean;
  isExpanded?: boolean;
  isFocused?: boolean;
  isRenaming?: boolean;
  isDraggingOver?: boolean;
  isDraggingOverParent?: boolean;
  isSearchMatching?: boolean;
}

export interface TreeItemRenderContext extends TreeItemActions, TreeItemRenderFlags {
  interactiveElementProps: HTMLProps<any>;
  itemContainerElementProps: HTMLProps<any>;
}

export interface TreeInformation {
  areItemsSelected?: boolean;
  isRenaming?: boolean;
  isFocused?: boolean;
  isSearching?: boolean;
  search?: string | null;
}

export interface TreeRenderProps<T = any> {
  renderItem?: (item: TreeItem<T>, depth: number, children: React.ReactNode | null, title: React.ReactNode, context: TreeItemRenderContext, info: TreeInformation) => React.ReactNode;
  renderItemTitle?: (title: string, item: TreeItem<T>, context: TreeItemRenderContext, info: TreeInformation) => React.ReactNode;
  renderRenameInput?: (item: TreeItem<T>, inputProps: Partial<InputHTMLAttributes<HTMLInputElement>>, submitButtonProps: Partial<ButtonHTMLAttributes<HTMLButtonElement>>) => React.ReactNode;
  renderDraggingItem?: (items: Array<TreeItem<T>>) => React.ReactNode;
  renderDraggingItemTitle?: (items: Array<TreeItem<T>>) => React.ReactNode;
  renderTreeContainer?: (children: React.ReactNode, containerProps: HTMLProps<any>, info: TreeInformation) => React.ReactNode;
  renderDragBetweenLine?: (draggingPosition: DraggingPosition, lineProps: HTMLProps<any>) => React.ReactNode;
  renderSearchInput?: (inputProps: HTMLProps<HTMLInputElement>) => React.ReactNode;
  renderDepthOffset?: number;
}

export type AllTreeRenderProps<T = any> = Required<TreeRenderProps<T>>;

export interface TreeCapabilities<T = any> {
  defaultInteractionMode?: 'click-to-activate' | 'click-to-select';
  allowDragAndDrop?: boolean;
  allowDropOnItemWithChildren?: boolean;
  allowDropOnItemWithoutChildren?: boolean;
  allowReorderingItems?: boolean;
  canDrag?: (items: TreeItem<T>[]) => boolean; // TODO not working with first drag before focus
  canDropAt?: (items: TreeItem<T>[], target: DraggingPosition) => boolean;
  canInvokePrimaryActionOnItemContainer?: boolean;
  canSearch?: boolean;
  doesSearchMatchItem?: (search: string, item: TreeItem<T>, itemTitle: string) => boolean;
}

export interface IndividualTreeViewState {
  renamingItem?: TreeItemIndex;
  selectedItems?: TreeItemIndex[];
  expandedItems?: TreeItemIndex[];
  untruncatedItems?: TreeItemIndex[];
  focusedItem?: TreeItemIndex;
}

export interface TreeViewState {
  [treeId: string]: IndividualTreeViewState | undefined;
}

export interface ExplicitDataSource<T = any> {
  items: Record<TreeItemIndex, TreeItem<T>>;
}

export interface ImplicitDataSource<T = any> {
  dataProvider: TreeDataProvider<T>;
}

export type DataSource<T = any> = ExplicitDataSource<T> | ImplicitDataSource<T>;

export interface TreeChangeHandlers<T = any> {
  onStartRenamingItem?: (item: TreeItem<T>, treeId: string) => void;
  onCollapseItem?: (item: TreeItem<T>, treeId: string) => void;
  onExpandItem?: (item: TreeItem<T>, treeId: string) => void;
  onRenameItem?: (item: TreeItem<T>, name: string, treeId: string) => void;
  onSelectItems?: (items: TreeItemIndex[], treeId: string) => void; // TODO TreeItem instead of just index
  onFocusItem?: (item: TreeItem<T>, treeId: string) => void;
  // onStartDrag?: (items: TreeItemIndex[], treeId: string) => void;
  onDrop?: (items: TreeItem<T>[], target: DraggingPosition) => void;
  onPrimaryAction?: (items: TreeItem<T>, treeId: string) => void;
  onRegisterTree?: (tree: TreeConfiguration) => void;
  onUnregisterTree?: (tree: TreeConfiguration) => void;
  onMissingItems?: (itemIds: TreeItemIndex[]) => void;
  onMissingChildren?: (itemIds: TreeItemIndex[]) => void; // TODO
};

export interface TreeEnvironmentConfiguration<T = any> extends
  TreeRenderProps<T>, TreeCapabilities<T>, TreeChangeHandlers<T>, ExplicitDataSource<T> {
  viewState: TreeViewState;
  keyboardBindings?: KeyboardBindings;
  getItemTitle: (item: TreeItem<T>) => string;
}

export interface TreeEnvironmentContextProps<T = any> extends Omit<TreeEnvironmentConfiguration<T>, keyof TreeRenderProps>, AllTreeRenderProps<T> {
  registerTree: (tree: TreeConfiguration<T>) => void;
  unregisterTree: (treeId: string) => void;
  onStartDraggingItems: (items: TreeItem<T>[], treeId: string) => void;
  draggingItems?: TreeItem<T>[];
  itemHeight: number;
  onDragAtPosition: (position: DraggingPosition | undefined) => void, // TODO
  draggingPosition?: DraggingPosition;
  activeTreeId?: string;
  setActiveTree: (treeId: string | undefined) => void;
}

export type DraggingPosition = DraggingPositionItem | DraggingPositionBetweenItems;

export interface AbstractDraggingPosition {
  targetType: 'item' | 'between-items';
  treeId: string;
  parentItem: TreeItemIndex;
  linearIndex?: number;
  depth: number;
}

export interface DraggingPositionItem extends AbstractDraggingPosition {
  targetType: 'item';
  targetItem: TreeItemIndex;
}

export interface DraggingPositionBetweenItems extends AbstractDraggingPosition {
  targetType: 'between-items';
  childIndex: number;
  linePosition: 'top' | 'bottom';
}

export type ControlledTreeEnvironmentProps<T = any> = PropsWithChildren<TreeEnvironmentConfiguration<T>>;

export type UncontrolledTreeEnvironmentProps<T = any> = PropsWithChildren<{
  viewState: TreeViewState;
  keyboardBindings?: KeyboardBindings;
  getItemTitle: (item: TreeItem<T>) => string;
} & TreeRenderProps<T> & TreeCapabilities & ImplicitDataSource<T>>;

export interface TreeConfiguration<T = any> {
  treeId: string;
  rootItem: string;
}

export interface TreeProps<T = any> extends TreeConfiguration<T>, Partial<TreeRenderProps<T>> {
}

export interface TreeContextProps<T = any> extends TreeConfiguration<T> {
  search: string | null;
  setSearch: (searchValue: string | null) => void;
  renderers: AllTreeRenderProps;
  treeInformation: TreeInformation;
}

export interface TreeDataProvider<T = any> {
  onDidChangeTreeData?: (listener: (changedItemIds: TreeItemIndex[]) => void) => Disposable;
  getTreeItem: (itemId: TreeItemIndex) => Promise<TreeItem>;
  getTreeItems?: (itemIds: TreeItemIndex[]) => Promise<TreeItem[]>;
  onRenameItem?: (item: TreeItem<T>, name: string) => Promise<void>;
  onChangeItemChildren?: (itemId: TreeItemIndex, newChildren: TreeItemIndex[]) => Promise<void>;
}

export type Disposable = {
  dispose: () => void;
}

export type CompleteTreeDataProvider<T = any> = Required<TreeDataProvider<T>>;

export interface KeyboardBindings {
  primaryAction?: string[];
  moveFocusToFirstItem?: string[];
  moveFocusToLastItem?: string[];
  expandSiblings?: string[];
  renameItem?: string[];
  toggleSelectItem?: string[];
  moveItems?: string[];
  abortMovingItems?: string[];
  abortSearch?: string[];
}