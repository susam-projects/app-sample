import { last } from "lodash";
import first from "lodash/first";

import { IHATEOASChildren, IHATEOASItem } from "@/common/api";
import i18n from "@/common/i18n";
import { ISelectOption } from "@/common/types";
import { skipNullable } from "@/common/utils/mapUtils.ts";
import { companyIcon } from "@/features/company";
import { deviceIcon } from "@/features/device";
import { moduleIcon } from "@/features/module";
import { replicationSiteIcon } from "@/features/replicationSite";
import { serverIcon } from "@/features/server";
import { shopIcon } from "@/features/shop";
import { tenantIcon } from "@/features/tenant";

import { TreeNodeIcon } from "../components/TreeNodeIcon/TreeNodeIcon.tsx";
import { ROOT_OBJECT } from "../constants/objectTree.constants.ts";
import {
  INodeLink,
  IStoreDataNode,
  IUiDataNode,
  ObjectType,
  TObjectId,
  TObjectTreeData,
  TUiNodeType,
  UiObjectType,
} from "../types/objectTreeTypes.ts";

export type TDecomposedKey = Array<{
  nodeType: TUiNodeType;
  nodeId: string;
}>;

export const NodeKey = {
  fullDecompose(nodeKey: string): TDecomposedKey {
    const hierarchy = nodeKey.split("/");
    return hierarchy.map((item) => {
      const [nodeType, ...nodeId] = item.split("-");
      return {
        nodeType: Objects.toUiObjectType(nodeType),
        nodeId: nodeId.join("-"),
      };
    });
  },

  decompose(nodeKey: string) {
    return last(NodeKey.fullDecompose(nodeKey))!;
  },

  _compose(nodeType: TUiNodeType, nodeId: TObjectId) {
    return `${nodeType}-${nodeId}`;
  },

  composeWithAncestorsKey(
    ancestorsKey: string,
    nodeType: TUiNodeType,
    nodeId: TObjectId,
  ) {
    return ancestorsKey
      ? `${ancestorsKey}/${NodeKey._compose(nodeType, nodeId)}`
      : NodeKey._compose(nodeType, nodeId);
  },
};

const ICONS_BY_OBJECT_TYPE: Readonly<Record<ObjectType, string>> = {
  [ObjectType.Unknown]: "",
  [ObjectType.Root]: "",
  [ObjectType.Server]: serverIcon,
  [ObjectType.Tenant]: tenantIcon,
  [ObjectType.ReplicationSite]: replicationSiteIcon,
  [ObjectType.Company]: companyIcon,
  [ObjectType.Shop]: shopIcon,
  [ObjectType.Device]: deviceIcon,
  [ObjectType.Module]: moduleIcon,
} as const;

const GROUP_TITLES: Readonly<Record<ObjectType, string>> = {
  [ObjectType.Unknown]: "",
  [ObjectType.Root]: "",
  [ObjectType.Server]: i18n.t("objectTree.group.server"),
  [ObjectType.Tenant]: i18n.t("objectTree.group.tenant"),
  [ObjectType.ReplicationSite]: i18n.t("objectTree.group.replicationSite"),
  [ObjectType.Company]: i18n.t("objectTree.group.company"),
  [ObjectType.Shop]: i18n.t("objectTree.group.shop"),
  [ObjectType.Device]: i18n.t("objectTree.group.device"),
  [ObjectType.Module]: i18n.t("objectTree.group.module"),
};

export const Objects = {
  _getChildByNodeLink:
    (objects: TObjectTreeData) =>
    (link: INodeLink): IStoreDataNode | undefined => {
      return objects[link.type]?.[link.id];
    },

  _isLeaf: (node: IStoreDataNode): boolean => {
    return node.type === ObjectType.Device || node.type === ObjectType.Module;
  },

  _toUiNode: (
    node: IStoreDataNode,
    children: IUiDataNode[],
    nodeKey: string,
  ): IUiDataNode => {
    const iconUrl = Objects.getObjectIconUrl(node);
    return {
      id: node.id,
      type: node.type,
      title: node.title,
      key: nodeKey,
      icon: iconUrl && <TreeNodeIcon iconUrl={iconUrl} />,
      isLeaf: Objects._isLeaf(node),
      isDisabled: !node.isEnabled,
      children,
    };
  },

  _addChildren: (node: IUiDataNode, children: IUiDataNode[]): IUiDataNode => {
    return {
      ...node,
      children,
    };
  },

  _createGroupNode: (type: ObjectType, parentKey: string) => {
    const id = Objects.createGroupId(type);
    const newNodeType = UiObjectType.Group;
    const iconUrl = ICONS_BY_OBJECT_TYPE[type];

    const groupNodeKey = NodeKey.composeWithAncestorsKey(
      parentKey,
      newNodeType,
      id,
    );

    const groupNode: IUiDataNode = {
      id,
      type: newNodeType,
      title: GROUP_TITLES[type],
      key: groupNodeKey,
      icon: iconUrl && <TreeNodeIcon iconUrl={iconUrl} />,
      isLeaf: false,
      isDisabled: false,
    };

    return { groupNode, groupNodeKey };
  },

  _setGroupIcon: (groupNode: IUiDataNode, children: IUiDataNode[]) => {
    groupNode.icon = first(children)?.icon || groupNode.icon;
  },

  createGroupId: (type: ObjectType) => {
    return `${type}-group`;
  },

  getObjectIconUrl: (object?: IStoreDataNode | null) => {
    if (object?.iconUrl) {
      return object.iconUrl;
    }
    if (object?.type) {
      return (
        ICONS_BY_OBJECT_TYPE[object.type] ||
        ICONS_BY_OBJECT_TYPE[ObjectType.Unknown]
      );
    }
    return ICONS_BY_OBJECT_TYPE[ObjectType.Unknown];
  },

  storeDataToFullUiData: (
    objects: TObjectTreeData,
  ): IUiDataNode | undefined => {
    const root = objects.root?.[ROOT_OBJECT.id];
    if (!root) return undefined;

    const collectTypes = (nodes: IStoreDataNode[]) => {
      const types = nodes.reduce((acc, node) => {
        acc.add(node.type);
        return acc;
      }, new Set<IStoreDataNode["type"]>());
      return [...types];
    };

    const traverseTree = (
      node: IStoreDataNode,
      ancestorsKey: string,
    ): IUiDataNode => {
      const children = (node.children || [])
        .map(Objects._getChildByNodeLink(objects))
        .filter(skipNullable) as IStoreDataNode[];

      const nodeKey = NodeKey.composeWithAncestorsKey(
        ancestorsKey,
        node.type,
        node.id,
      );

      const childrenTypes = collectTypes(children);
      if (childrenTypes.length > 1) {
        // add group nodes
        const groups = childrenTypes.map((type) => {
          const { groupNode, groupNodeKey } = Objects._createGroupNode(
            type,
            nodeKey,
          );
          const mappedChildren = children
            .filter((child) => child.type === type)
            .map((child) => traverseTree(child, groupNodeKey));
          Objects._setGroupIcon(groupNode, mappedChildren);
          return Objects._addChildren(groupNode, mappedChildren);
        });
        return Objects._toUiNode(node, groups, nodeKey);
      } else {
        // base flow
        const mappedChildren = children.map((child) =>
          traverseTree(child, nodeKey),
        );
        return Objects._toUiNode(node, mappedChildren, nodeKey);
      }
    };

    return traverseTree(root, "");
  },

  storeDataToUiData: (objects: TObjectTreeData): IUiDataNode[] => {
    const uiTreeRoot = Objects.storeDataToFullUiData(objects);
    return uiTreeRoot?.children || [];
  },

  storeNodeToUiNode: (
    object: IStoreDataNode,
    objectKey: string,
  ): IUiDataNode => {
    return Objects._toUiNode(object, [], objectKey);
  },

  storeNodeToSelectOptions: (objects: IStoreDataNode[]): ISelectOption[] => {
    return objects.map((item) => ({ value: item.id, label: item.title }));
  },

  toObjectType: (objectTypeString: string): ObjectType => {
    const objectType = Object.values(ObjectType).find(
      (type) => (type as string) === objectTypeString.toLowerCase(),
    );
    return objectType ?? ObjectType.Unknown;
  },

  toUiObjectType: (objectTypeString: string): TUiNodeType => {
    const objectType = Objects.toObjectType(objectTypeString);
    const uiObjectType = Object.values(UiObjectType).find(
      (type) => (type as string) === objectTypeString.toLowerCase(),
    );
    return uiObjectType || objectType;
  },

  _serverItemToStoreNode: (item: IHATEOASItem): IStoreDataNode => {
    return {
      id: item.objectId || "",
      type: Objects.toObjectType(item.objectType || ""),
      title: item.displayName || "",
      isEnabled: !!item.enabled,
      iconUrl: item.iconUrl || undefined,
      children: undefined,
      selfLinks: Array.isArray(item.links) ? item.links : [],
    };
  },

  serverDataToStoreData: (items: IHATEOASItem[]): IStoreDataNode[] => {
    return items.map(Objects._serverItemToStoreNode);
  },

  _serverChildrenToStoreNode: (
    type: string,
    children: IHATEOASItem[],
  ): IStoreDataNode[] => {
    return children.map((item) => ({
      ...Objects._serverItemToStoreNode(item),
      type: Objects.toObjectType(type),
    }));
  },

  serverChildrenToStoreData: (items: IHATEOASChildren[]): IStoreDataNode[] => {
    return items
      .flatMap(
        (item) =>
          (typeof item.itemsType === "string" &&
            Array.isArray(items) &&
            Objects._serverChildrenToStoreNode(
              item.itemsType,
              item.items!,
            )) as IStoreDataNode[],
      )
      .filter(skipNullable);
  },
};
