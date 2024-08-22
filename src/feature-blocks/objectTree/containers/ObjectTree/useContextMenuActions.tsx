import { useCallback, useMemo } from "react";

import {
  BlockOutlined,
  CopyOutlined,
  FileAddOutlined,
  FileTextOutlined,
  JavaScriptOutlined,
  MinusOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { MenuProps, notification } from "antd";
import first from "lodash/first";

import { useAppDispatch, useAppSelector } from "@/app/store";
import i18n from "@/common/i18n";
import { alwaysTrue, skipNullable } from "@/common/utils/mapUtils.ts";

import {
  ERROR_LOADING_OBJECT,
  ERROR_UPDATING_OBJECT,
} from "../../constants/objectTree.errors.ts";
import { useObjectsNavigate } from "../../router/useObjectsNavigate.ts";
import {
  clearContextMenuObjects,
  disableNode,
  enableNode,
  selectContextMenuItems,
  selectContextMenuNodes,
  setTestData,
} from "../../store/objectTree.slice.ts";
import {
  IUiDataNode,
  ObjectType,
  UiObjectType,
} from "../../types/objectTreeTypes.ts";

import { useTreeData } from "./useObjectTree.ts";

type MenuItem = Required<MenuProps>["items"][number];

export const enum ContextMenuAction {
  Reload = "reload",
  Enable = "enable",
  Disable = "disable",
  AddTenant = "add-tenant",
  AddReplicationSite = "add-replication-site",
  AddCompany = "add-company",
  AddShop = "add-shop",
  AddDevice = "add-device",
  DuplicateTenant = "duplicate-tenant",
  DuplicateReplicationSite = "duplicate-replication-site",
  DuplicateCompany = "duplicate-company",
  DuplicateShop = "duplicate-shop",
  DuplicateDevice = "duplicate-device",
  ShowHistory = "show-history",
  CopyConfiguration = "copy-configuration",
  UseTestData = "use-test-data",
}

export const CONTEXT_MENU_ITEMS: Record<ContextMenuAction, MenuItem> = {
  [ContextMenuAction.Reload]: {
    key: ContextMenuAction.Reload,
    label: i18n.t("objectTree.contextMenu.reload"),
    icon: <ReloadOutlined />,
  },
  [ContextMenuAction.Enable]: {
    key: ContextMenuAction.Enable,
    label: i18n.t("objectTree.contextMenu.enable"),
    icon: <PlusOutlined />,
  },
  [ContextMenuAction.Disable]: {
    key: ContextMenuAction.Disable,
    label: i18n.t("objectTree.contextMenu.disable"),
    icon: <MinusOutlined />,
  },
  [ContextMenuAction.AddTenant]: {
    key: ContextMenuAction.AddTenant,
    label: i18n.t("objectTree.contextMenu.addChild", { childType: "tenant" }),
    icon: <FileAddOutlined />,
  },
  [ContextMenuAction.AddReplicationSite]: {
    key: ContextMenuAction.AddReplicationSite,
    label: i18n.t("objectTree.contextMenu.addChild", { childType: "site" }),
    icon: <FileAddOutlined />,
  },
  [ContextMenuAction.AddCompany]: {
    key: ContextMenuAction.AddCompany,
    label: i18n.t("objectTree.contextMenu.addChild", { childType: "company" }),
    icon: <FileAddOutlined />,
  },
  [ContextMenuAction.AddShop]: {
    key: ContextMenuAction.AddShop,
    label: i18n.t("objectTree.contextMenu.addChild", { childType: "shop" }),
    icon: <FileAddOutlined />,
  },
  [ContextMenuAction.AddDevice]: {
    key: ContextMenuAction.AddDevice,
    label: i18n.t("objectTree.contextMenu.addChild", { childType: "device" }),
    icon: <FileAddOutlined />,
  },
  [ContextMenuAction.DuplicateTenant]: {
    key: ContextMenuAction.DuplicateTenant,
    label: i18n.t("objectTree.contextMenu.duplicate"),
    icon: <CopyOutlined />,
  },
  [ContextMenuAction.DuplicateReplicationSite]: {
    key: ContextMenuAction.DuplicateReplicationSite,
    label: i18n.t("objectTree.contextMenu.duplicate"),
    icon: <CopyOutlined />,
  },
  [ContextMenuAction.DuplicateCompany]: {
    key: ContextMenuAction.DuplicateCompany,
    label: i18n.t("objectTree.contextMenu.duplicate"),
    icon: <CopyOutlined />,
  },
  [ContextMenuAction.DuplicateShop]: {
    key: ContextMenuAction.DuplicateShop,
    label: i18n.t("objectTree.contextMenu.duplicate"),
    icon: <CopyOutlined />,
  },
  [ContextMenuAction.DuplicateDevice]: {
    key: ContextMenuAction.DuplicateDevice,
    label: i18n.t("objectTree.contextMenu.duplicate"),
    icon: <CopyOutlined />,
  },
  [ContextMenuAction.ShowHistory]: {
    key: ContextMenuAction.ShowHistory,
    label: i18n.t("objectTree.contextMenu.showHistory"),
    icon: <FileTextOutlined />,
  },
  [ContextMenuAction.CopyConfiguration]: {
    key: ContextMenuAction.CopyConfiguration,
    label: i18n.t("objectTree.contextMenu.copyConfiguration"),
    icon: <BlockOutlined />,
  },
  // TODO: remove it later
  [ContextMenuAction.UseTestData]: {
    key: ContextMenuAction.UseTestData,
    label: "Use test data",
    icon: <JavaScriptOutlined />,
  },
};

const ACTIONS_OF_NODE_TYPE: Record<
  string,
  Array<{
    action: ContextMenuAction;
    isVisible?: (nodes: IUiDataNode[]) => boolean;
  }>
> = {
  default: [{ action: ContextMenuAction.UseTestData }],

  multiple: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) =>
        !!first(nodes)?.isDisabled &&
        nodes.every((node) => node.type === ObjectType.Module),
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) =>
        !first(nodes)?.isDisabled &&
        nodes.every((node) => node.type === ObjectType.Module),
    },
    {
      action: ContextMenuAction.CopyConfiguration,
      isVisible: (nodes) =>
        nodes.every((node) => node.type === ObjectType.Module),
    },
  ],

  [UiObjectType.Group]: [],

  [ObjectType.Server]: [
    { action: ContextMenuAction.AddTenant },
    // { action: ContextMenuAction.ShowHistory }, // enable when API is ready
    { action: ContextMenuAction.Reload },
  ],

  [ObjectType.Tenant]: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) => !!first(nodes)?.isDisabled,
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) => !first(nodes)?.isDisabled,
    },
    { action: ContextMenuAction.DuplicateTenant },
    { action: ContextMenuAction.AddReplicationSite },
    { action: ContextMenuAction.AddCompany },
    // { action: ContextMenuAction.ShowHistory }, // enable when it's needed
    { action: ContextMenuAction.Reload },
  ],

  [ObjectType.Company]: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) => !!first(nodes)?.isDisabled,
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) => !first(nodes)?.isDisabled,
    },
    { action: ContextMenuAction.DuplicateCompany },
    { action: ContextMenuAction.AddShop },
    // { action: ContextMenuAction.ShowHistory }, // enable when it's needed
    { action: ContextMenuAction.Reload },
  ],

  [ObjectType.ReplicationSite]: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) => !!first(nodes)?.isDisabled,
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) => !first(nodes)?.isDisabled,
    },
    { action: ContextMenuAction.DuplicateReplicationSite },
    { action: ContextMenuAction.AddShop },
    // { action: ContextMenuAction.ShowHistory }, // enable when it's needed
    { action: ContextMenuAction.Reload },
  ],

  [ObjectType.Shop]: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) => !!first(nodes)?.isDisabled,
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) => !first(nodes)?.isDisabled,
    },
    { action: ContextMenuAction.DuplicateShop },
    { action: ContextMenuAction.AddDevice },
    // { action: ContextMenuAction.ShowHistory }, // enable when it's needed
    { action: ContextMenuAction.Reload },
  ],

  [ObjectType.Device]: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) => !!first(nodes)?.isDisabled,
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) => !first(nodes)?.isDisabled,
    },
    { action: ContextMenuAction.DuplicateDevice },
    // { action: ContextMenuAction.ShowHistory }, // enable when it's needed
    { action: ContextMenuAction.Reload },
  ],

  [ObjectType.Module]: [
    {
      action: ContextMenuAction.Enable,
      isVisible: (nodes) => !!first(nodes)?.isDisabled,
    },
    {
      action: ContextMenuAction.Disable,
      isVisible: (nodes) => !first(nodes)?.isDisabled,
    },
    { action: ContextMenuAction.CopyConfiguration },
    // { action: ContextMenuAction.ShowHistory }, // enable when it's needed
    { action: ContextMenuAction.Reload },
  ],
};

export const getContextMenuItems = (nodes: IUiDataNode[]) => {
  if (!nodes.length) {
    // TODO: remove it
    return [CONTEXT_MENU_ITEMS[ContextMenuAction.UseTestData]];
  }

  if (nodes.length > 1) {
    return ACTIONS_OF_NODE_TYPE["multiple"]
      .filter(({ isVisible = alwaysTrue }) => isVisible(nodes))
      .map(({ action }) => CONTEXT_MENU_ITEMS[action])
      .filter(skipNullable);
  }

  const node = first(nodes)!;
  return (ACTIONS_OF_NODE_TYPE[node.type] || ACTIONS_OF_NODE_TYPE["default"])
    .filter(({ isVisible = alwaysTrue }) => isVisible(nodes))
    .map(({ action }) => CONTEXT_MENU_ITEMS[action])
    .filter(skipNullable);
};

export const useContextMenuActions = ({
  loadData,
  showLoadDataError,
}: {
  loadData: ReturnType<typeof useTreeData>["loadData"];
  showLoadDataError: ReturnType<typeof useTreeData>["showLoadDataError"];
}) => {
  const navigate = useObjectsNavigate();
  const dispatch = useAppDispatch();
  const contextMenuItems = useAppSelector(selectContextMenuItems);
  const contextMenuNodes = useAppSelector(selectContextMenuNodes);

  const onEnableDisableNodeError = (errorType: string) => {
    const errorMessage =
      errorType === ERROR_LOADING_OBJECT
        ? i18n.t("objectTree.contextMenu.error.loadingObject").toString()
        : errorType === ERROR_UPDATING_OBJECT
          ? i18n.t("objectTree.contextMenu.error.updatingObject").toString()
          : i18n.t("objectTree.contextMenu.error.updatingObject").toString();
    notification.error({ message: errorMessage });
  };

  const ACTION_HANDLERS: Record<ContextMenuAction, () => void> = useMemo(
    () => ({
      // TODO: remove it
      [ContextMenuAction.UseTestData]: () => {
        dispatch(setTestData());
      },

      [ContextMenuAction.Reload]: () => {
        const node = first(contextMenuNodes)!;
        loadData({
          parentKey: node.key,
          parentId: node.id,
          parentType: node.type,
          onError: (error) => {
            showLoadDataError(error);
          },
        });
      },

      [ContextMenuAction.Enable]: () => {
        const node = first(contextMenuNodes)!;
        if (node.type === ObjectType.Module) {
          navigate({
            route: "module/change-status",
            objectKeys: contextMenuNodes.map((node) => node.key),
          });
        } else {
          const onSuccess = () => {
            notification.success({
              message: i18n.t("objectTree.contextMenu.enable").toString(),
            });
          };
          void dispatch(
            enableNode({
              key: node.key,
              onSuccess,
              onError: onEnableDisableNodeError,
            }),
          );
        }
      },

      [ContextMenuAction.Disable]: () => {
        const node = first(contextMenuNodes)!;
        if (node.type === ObjectType.Module) {
          navigate({
            route: "module/change-status",
            objectKeys: contextMenuNodes.map((node) => node.key),
          });
        } else {
          const onSuccess = () => {
            notification.success({
              message: i18n.t("objectTree.contextMenu.disable").toString(),
            });
          };
          void dispatch(
            disableNode({
              key: node.key,
              onSuccess,
              onError: onEnableDisableNodeError,
            }),
          );
        }
      },

      [ContextMenuAction.AddTenant]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "tenant/add", objectKeys: [node.key] });
      },
      [ContextMenuAction.AddReplicationSite]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "replicationsite/add", objectKeys: [node.key] });
      },
      [ContextMenuAction.AddCompany]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "company/add", objectKeys: [node.key] });
      },
      [ContextMenuAction.AddShop]: () => {
        const node = first(contextMenuNodes)!;
        navigate({
          route: "shop/add",
          objectKeys: [node.key],
        });
      },
      [ContextMenuAction.AddDevice]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "device/add", objectKeys: [node.key] });
      },

      [ContextMenuAction.DuplicateTenant]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "tenant/duplicate", objectKeys: [node.key] });
      },
      [ContextMenuAction.DuplicateReplicationSite]: () => {
        const node = first(contextMenuNodes)!;
        navigate({
          route: "replicationsite/duplicate",
          objectKeys: [node.key],
        });
      },
      [ContextMenuAction.DuplicateCompany]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "company/duplicate", objectKeys: [node.key] });
      },
      [ContextMenuAction.DuplicateShop]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "shop/duplicate", objectKeys: [node.key] });
      },
      [ContextMenuAction.DuplicateDevice]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "device/duplicate", objectKeys: [node.key] });
      },

      [ContextMenuAction.ShowHistory]: () => {
        const node = first(contextMenuNodes)!;
        navigate({ route: "history", objectKeys: [node.key] });
      },

      [ContextMenuAction.CopyConfiguration]: () => {
        const node = first(contextMenuNodes)!;
        navigate({
          route: `${node.type}/copy`,
          objectKeys: contextMenuNodes.map((node) => node.key),
        });
      },
    }),
    [dispatch, contextMenuNodes, loadData, showLoadDataError, navigate],
  );

  const processContextMenuAction_ = (action: ContextMenuAction) => {
    ACTION_HANDLERS[action]?.();
    dispatch(clearContextMenuObjects());
  };
  const processContextMenuAction = useCallback(processContextMenuAction_, [
    ACTION_HANDLERS,
    dispatch,
  ]);

  return {
    contextMenuItems,
    processContextMenuAction,
  };
};
