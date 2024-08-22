import { skipNullable } from "@/common/utils/mapUtils.ts";

import { ROOT_OBJECT } from "../constants/objectTree.constants.ts";
import { NodeKey } from "../mappers/objectTree.mappers.tsx";
import {
  TObjectTreeData,
  INodeLink,
  IStoreDataNode,
  ObjectType,
  TObjectId,
  TUiNodeType,
} from "../types/objectTreeTypes.ts";

export const treeService = {
  _getNode: (
    treeData: TObjectTreeData,
    nodeType: ObjectType,
    nodeId: TObjectId,
  ): IStoreDataNode | undefined => {
    return treeData[nodeType]?.[nodeId];
  },

  _getChildByNodeLink:
    (objects: TObjectTreeData) =>
    (link: INodeLink): IStoreDataNode | undefined => {
      return objects[link.type]?.[link.id];
    },

  setChildren: (
    treeData: TObjectTreeData,
    parentType: ObjectType,
    parentId: TObjectId,
    children: IStoreDataNode[],
  ) => {
    const parent = treeService._getNode(treeData, parentType, parentId);
    if (!parent) return treeData;

    parent.children = [...children];

    children.forEach((child) => {
      const dataOfType = (treeData[child.type] = treeData[child.type] || {});
      dataOfType[child.id] = child;
    });

    return { ...treeData };
  },

  getItem: (
    objects: TObjectTreeData,
    itemType: TUiNodeType,
    itemId: TObjectId,
  ): IStoreDataNode | undefined => {
    return objects[itemType as ObjectType]?.[itemId];
  },

  getItemByKey: (
    objects: TObjectTreeData,
    objectKey: string,
  ): IStoreDataNode | undefined => {
    const { nodeId, nodeType } = NodeKey.decompose(objectKey);
    return treeService.getItem(objects, nodeType, nodeId);
  },

  getChildren: (
    objects: TObjectTreeData,
    item: IStoreDataNode,
  ): IStoreDataNode[] => {
    return (item.children || [])
      .map(treeService._getChildByNodeLink(objects))
      .filter(skipNullable) as IStoreDataNode[];
  },

  getParentItem: (
    objects: TObjectTreeData,
    item: IStoreDataNode,
  ): IStoreDataNode | undefined => {
    const traverseTree = (node: IStoreDataNode): IStoreDataNode | undefined => {
      const children = treeService.getChildren(objects, node);

      const isParentOfTheItem =
        children.findIndex(
          (child) => child.type === item.type && child.id === item.id,
        ) !== -1;
      if (isParentOfTheItem) {
        return node;
      }

      for (const child of children) {
        const foundNode = traverseTree(child);
        if (foundNode) {
          return foundNode;
        }
      }

      return undefined;
    };

    const rootItem = treeService.getItem(
      objects,
      ROOT_OBJECT.type,
      ROOT_OBJECT.id,
    );
    return rootItem && traverseTree(rootItem);
  },

  getAncestorItem: (
    objects: TObjectTreeData,
    descendant: IStoreDataNode,
    ancestorType: ObjectType,
  ): IStoreDataNode | undefined => {
    const isDescendant = (
      ancestor: IStoreDataNode,
      descendant: IStoreDataNode,
    ) => {
      const children = treeService.getChildren(objects, ancestor);

      const isParentOfTheItem = children.some(
        (child) => child.id === descendant.id && child.type === descendant.type,
      );
      if (isParentOfTheItem) {
        return true;
      }

      for (const child of children) {
        if (isDescendant(child, descendant)) {
          return true;
        }
      }

      return false;
    };

    const traverseTree = (node: IStoreDataNode): IStoreDataNode | undefined => {
      if (node.type === ancestorType && isDescendant(node, descendant)) {
        return node;
      }

      const children = treeService.getChildren(objects, node);

      for (const child of children) {
        const foundNode = traverseTree(child);
        if (foundNode) {
          return foundNode;
        }
      }

      return undefined;
    };

    const rootItem = treeService.getItem(
      objects,
      ROOT_OBJECT.type,
      ROOT_OBJECT.id,
    );
    return rootItem && traverseTree(rootItem);
  },
};
