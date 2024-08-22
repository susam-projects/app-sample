import {
  flip,
  shift,
  useClientPoint,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

import { useAppDispatch, useAppSelector } from "@/app/store";

import {
  closeContextMenu,
  openContextMenu,
  selectContextMenuPosition,
  setContextMenuObjects,
} from "../../store/objectTree.slice.ts";

import { CONTEXT_MENU_PADDING } from "./ContextMenu.styles.ts";

export const useContextMenu = () => {
  const dispatch = useAppDispatch();
  const contextMenuPosition = useAppSelector(selectContextMenuPosition);

  const { refs, floatingStyles, context } = useFloating({
    open: !!contextMenuPosition,
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        dispatch(closeContextMenu());
      }
    },
    middleware: [shift({ padding: CONTEXT_MENU_PADDING }), flip()],
    placement: "bottom-start",
  });

  const clientPoint = useClientPoint(context, {
    x: contextMenuPosition?.x || 0,
    y: contextMenuPosition?.y || 0,
  });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
  ]);

  const openMenu = (params: { x: number; y: number; nodeKeys: string[] }) => {
    dispatch(setContextMenuObjects({ keys: params.nodeKeys }));
    dispatch(openContextMenu(params));
  };

  const closeMenu = () => {
    dispatch(closeContextMenu());
  };

  return {
    open: openMenu,
    close: closeMenu,
    _isOpen: !!contextMenuPosition,
    _refs: refs,
    _floatingStyles: floatingStyles,
    _getReferenceProps: getReferenceProps,
    _getFloatingProps: getFloatingProps,
  };
};
