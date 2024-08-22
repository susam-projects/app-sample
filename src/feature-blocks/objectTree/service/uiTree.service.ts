import first from "lodash/first";

import { NodeKey, TDecomposedKey } from "../mappers/objectTree.mappers.tsx";
import { IUiDataNode } from "../types/objectTreeTypes.ts";

export const uiTreeService = {
  getDescendantKeys: (root: IUiDataNode, itemKey: string): string[] => {
    const item = uiTreeService.getUiItemByKey(root, itemKey);
    if (!item) return [];

    const traverseTree = (node: IUiDataNode): string[] => {
      const children = node.children || [];
      return children.flatMap((child) => {
        return [child.key, ...traverseTree(child)];
      });
    };
    return traverseTree(item);
  },

  getUiItemByKey: (root: IUiDataNode, key: string): IUiDataNode | undefined => {
    const decomposedKey = NodeKey.fullDecompose(key);

    const traverseTree = (
      node: IUiDataNode,
      key: TDecomposedKey,
    ): IUiDataNode | undefined => {
      const currentKeyPart = first(key);

      if (
        node.id === currentKeyPart?.nodeId &&
        node.type === currentKeyPart?.nodeType
      ) {
        const nextKey = key.slice(1);
        if (!nextKey.length) {
          return node;
        }

        const found = node.children?.flatMap((child) => {
          const foundNode = traverseTree(child, nextKey);
          if (foundNode) {
            return [foundNode];
          }
          return [];
        });

        return first(found);
      }

      return undefined;
    };

    return traverseTree(root, decomposedKey);
  },
};
