import { ComponentProps, MouseEvent, useCallback, useMemo } from "react";

import { notification, Tree } from "antd";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { useOnMount } from "@/common/hooks";
import { clearDefaultDragImage } from "@/common/utils/dragAndDropUtils.ts";

import { ContextMenu } from "../../components/ContextMenu/ContextMenu.tsx";
import { useContextMenu } from "../../components/ContextMenu/useContextMenu.ts";
import {
  ERROR_LOADING_CHILDREN,
  ERROR_NO_CHILDREN,
} from "../../constants/objectTree.errors.ts";
import { canMove } from "../../service/objectsMoveConstraints.service.ts";
import {
  clear,
  loadInitialData,
  loadNodeChildren,
  selectMovingObjects,
  selectNode,
  selectSelectedKeys,
  selectTreeRawData,
  setMovingObjects,
  setMovingTarget,
} from "../../store/objectTree.slice.ts";
import { IUiDataNode } from "../../types/objectTreeTypes.ts";
import { useMoveModal } from "../MoveModal/useMoveModal.ts";

import {
  ContextMenuAction,
  useContextMenuActions,
} from "./useContextMenuActions.tsx";

type TLoadData = ComponentProps<typeof Tree<IUiDataNode>>["loadData"];
type TOnMenuSelect = ComponentProps<typeof ContextMenu>["onSelect"];
type TOnClick = ComponentProps<typeof Tree<IUiDataNode>>["onClick"];
type TOnRightClick = ComponentProps<typeof Tree<IUiDataNode>>["onRightClick"];
type TOnDragStart = ComponentProps<typeof Tree<IUiDataNode>>["onDragStart"];
type TOnDrop = ComponentProps<typeof Tree<IUiDataNode>>["onDrop"];
type TAllowDrop = ComponentProps<typeof Tree<IUiDataNode>>["allowDrop"];

export const useTreeData = ({
  notify,
}: {
  notify: ReturnType<typeof notification.useNotification>[0];
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useOnMount(() => {
    const initData = debounce(
      () => {
        const onError = () => {
          notify.error({ message: t("objectTree.error.loadingInitData") });
        };
        void dispatch(loadInitialData({ onError }));
      },
      300,
      { leading: false, trailing: true },
    );

    initData();

    return () => {
      initData.cancel();
      dispatch(clear());
    };
  });

  const showLoadDataError = useCallback(
    (error: unknown) => {
      switch (error) {
        case ERROR_LOADING_CHILDREN:
          notify.error({
            message: t("objectTree.error.loadingChildren"),
          });
          break;
        case ERROR_NO_CHILDREN:
          notify.warning({
            message: t("objectTree.error.noChildren"),
          });
          break;
        default:
          notify.error({
            message: t("objectTree.error.loadingChildren"),
          });
          break;
      }
    },
    [notify, t],
  );

  const loadData = useMemo(
    () =>
      debounce(
        (...args: Parameters<typeof loadNodeChildren>) => {
          void dispatch(loadNodeChildren(...args));
        },
        300,
        { leading: false, trailing: true },
      ),
    [dispatch],
  );

  const handleLoadData = useCallback<NonNullable<TLoadData>>(
    (node) => {
      return new Promise<void>((resolve) => {
        loadData({
          parentKey: node.key,
          parentId: node.id,
          parentType: node.type,
          onError: (error) => {
            showLoadDataError(error);
          },
          onFinish: () => {
            resolve();
          },
        });
      });
    },
    [loadData, showLoadDataError],
  );

  return {
    notify,
    loadData,
    showLoadDataError,
    handleLoadData,
  };
};

export const useTreeSelection = () => {
  const dispatch = useAppDispatch();
  const selectedKeys = useAppSelector(selectSelectedKeys);

  const handleClick = useCallback<NonNullable<TOnClick>>(
    (event, node) => {
      dispatch(
        selectNode({
          isCtrlPressed: event.ctrlKey,
          nodeKey: node.key,
          nodeType: node.type,
        }),
      );
    },
    [dispatch],
  );

  return {
    selectedKeys,
    handleClick,
  };
};

export const useObjectTreeContextMenu = ({
  selectedKeys,
  loadData,
  showLoadDataError,
}: {
  selectedKeys: string[];
  loadData: ReturnType<typeof useTreeData>["loadData"];
  showLoadDataError: ReturnType<typeof useTreeData>["showLoadDataError"];
}) => {
  const menu = useContextMenu();
  const { contextMenuItems, processContextMenuAction } = useContextMenuActions({
    loadData,
    showLoadDataError,
  });

  const handleRightClick = useCallback<NonNullable<TOnRightClick>>(
    (info) => {
      info.event.stopPropagation();

      const nodeKeys = selectedKeys.includes(info.node.key)
        ? selectedKeys
        : [info.node.key];

      menu.open({
        x: info.event.clientX,
        y: info.event.clientY,
        nodeKeys,
      });
    },
    [menu, selectedKeys],
  );

  // TODO: remove it
  const handleNonTreeRightClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      menu.open({
        x: event.clientX,
        y: event.clientY,
        nodeKeys: [],
      });
    },
    [menu],
  );

  const handleMenuSelect = useCallback<NonNullable<TOnMenuSelect>>(
    (info) => {
      processContextMenuAction(info.key as ContextMenuAction);
      menu.close();
    },
    [menu, processContextMenuAction],
  );

  return {
    menu,
    contextMenuItems,
    handleRightClick,
    handleNonTreeRightClick,
    handleMenuSelect,
  };
};

export const useDragAndDrop = ({
  selectedKeys,
  moveModal,
}: {
  selectedKeys: string[];
  moveModal: ReturnType<typeof useMoveModal>;
}) => {
  const dispatch = useAppDispatch();
  const movingObjects = useAppSelector(selectMovingObjects);
  const treeData = useAppSelector(selectTreeRawData);

  const handleDragStart = useCallback<NonNullable<TOnDragStart>>(
    (info) => {
      const movingObjectKeys = selectedKeys.includes(info.node.key)
        ? selectedKeys
        : [info.node.key];
      dispatch(setMovingObjects({ keys: movingObjectKeys }));

      const { dataTransfer } = info.event;
      dataTransfer.effectAllowed = "move";
      clearDefaultDragImage(dataTransfer);
    },
    [dispatch, selectedKeys],
  );

  const handleDrop = useCallback<NonNullable<TOnDrop>>(
    (info) => {
      dispatch(setMovingTarget({ key: info.node.key }));
      moveModal.show();
    },
    [dispatch, moveModal],
  );

  const isAllowDrop = useCallback<NonNullable<TAllowDrop>>(
    (info) => {
      return canMove(treeData, movingObjects, info.dropNode);
    },
    [movingObjects, treeData],
  );

  return {
    handleDragStart,
    handleDrop,
    isAllowDrop,
  };
};
