import { ComponentProps, FC, useCallback, useMemo } from "react";

import { notification, Tree } from "antd";

import { useAppDispatch, useAppSelector } from "@/app/store";

import { ContextMenu } from "../../components/ContextMenu/ContextMenu.tsx";
import { TreeNodeTitle } from "../../components/TreeNodeTitle/TreeNodeTitle.tsx";
import {
  collapseNode,
  expandNode,
  selectExpandedKeys,
  selectLoadedKeys,
  selectTreeData,
} from "../../store/objectTree.slice.ts";
import { IUiDataNode } from "../../types/objectTreeTypes.ts";
import { MoveModal } from "../MoveModal/MoveModal.tsx";
import { useMoveModal } from "../MoveModal/useMoveModal.ts";

import {
  useDragAndDrop,
  useObjectTreeContextMenu,
  useTreeData,
  useTreeSelection,
} from "./useObjectTree.ts";

type TOnExpand = ComponentProps<typeof Tree<IUiDataNode>>["onExpand"];
type TTitleRenderer = ComponentProps<typeof Tree<IUiDataNode>>["titleRender"];

interface IObjectTreeProps {}
export const ObjectTree: FC<IObjectTreeProps> = () => {
  const dispatch = useAppDispatch();
  const treeData = useAppSelector(selectTreeData);
  const loadedKeys = useAppSelector(selectLoadedKeys);
  const expandedKeys = useAppSelector(selectExpandedKeys);
  const [notify, notificationContext] = notification.useNotification();

  const moveModal = useMoveModal({
    onOk: () => {
      console.log("it's ok...");
    },
  });

  // prettier-ignore
  const {
    loadData,
    showLoadDataError,
    handleLoadData
  } = useTreeData({ notify });

  // prettier-ignore
  const {
    selectedKeys,
    handleClick
  } = useTreeSelection();

  // prettier-ignore
  const {
    menu,
    contextMenuItems,
    handleRightClick,
    handleNonTreeRightClick, // TODO: remove it
    handleMenuSelect
  } = useObjectTreeContextMenu({
    selectedKeys,
    loadData,
    showLoadDataError,
  });

  // prettier-ignore
  const {
    handleDragStart,
    handleDrop,
    isAllowDrop
  } = useDragAndDrop({ selectedKeys, moveModal });

  const handleExpand = useCallback<NonNullable<TOnExpand>>(
    (keys, info) => {
      if (info.expanded) {
        dispatch(expandNode({ nodeKey: info.node.key }));
      } else {
        dispatch(collapseNode({ keys: keys as string[] }));
      }
    },
    [dispatch],
  );

  const titleRenderer = useMemo<TTitleRenderer>(
    // eslint-disable-next-line react/display-name
    () => (data) => <TreeNodeTitle data={data} />,
    [],
  );

  return (
    <>
      {notificationContext}
      {/* TODO: remove the wrapper */}
      <div style={{ height: "100%" }} onContextMenu={handleNonTreeRightClick}>
        <Tree
          loadData={handleLoadData}
          treeData={treeData}
          loadedKeys={loadedKeys}
          expandedKeys={expandedKeys}
          onExpand={handleExpand}
          onRightClick={handleRightClick}
          showIcon
          blockNode
          multiple
          selectedKeys={selectedKeys}
          onClick={handleClick}
          // draggable={{ icon: false }} // TODO: enable when / if need to enable move by drag'n'drop
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          allowDrop={isAllowDrop}
          titleRender={titleRenderer}
        />
      </div>
      <ContextMenu
        controller={menu}
        items={contextMenuItems}
        onSelect={handleMenuSelect}
      />
      <MoveModal controller={moveModal} />
    </>
  );
};
