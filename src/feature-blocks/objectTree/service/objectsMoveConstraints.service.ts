import first from "lodash/first";
import intersection from "lodash/intersection";
import uniqBy from "lodash/uniqBy";

import { skipNullable } from "@/common/utils/mapUtils.ts";

import {
  IStoreDataNode,
  ObjectType,
  IUiDataNode,
  TObjectTreeData,
  TUiNodeType,
} from "../types/objectTreeTypes.ts";

import { treeService } from "./tree.service.ts";

const NON_DRAGGABLE_OBJECTS: TUiNodeType[] = [
  ObjectType.Server,
  ObjectType.Tenant,
];
const WITH_SAME_CHILDREN: TUiNodeType[] = [
  ObjectType.ReplicationSite,
  ObjectType.Company,
];

const collectObjectTypes = (objects: IStoreDataNode[]) => {
  const allTypes = objects.map((obj) => obj.type);
  const uniqueTypes = new Set([...allTypes]);
  return [...uniqueTypes];
};

const collectObjectParents = (
  tree: TObjectTreeData,
  objects: IStoreDataNode[],
) => {
  const parents = objects
    .map((obj) => treeService.getParentItem(tree, obj)!)
    .filter(skipNullable);
  return uniqBy(parents, (obj) => obj.id);
};

const isWithSameChildren = (
  parent1Type: TUiNodeType,
  parent2Type: TUiNodeType,
) => {
  return (
    parent1Type === parent2Type ||
    (WITH_SAME_CHILDREN.indexOf(parent1Type) !== -1 &&
      WITH_SAME_CHILDREN.indexOf(parent2Type) !== -1)
  );
};

export const canMove = (
  objects: TObjectTreeData,
  movingObjects: IStoreDataNode[],
  dropNode: IUiDataNode,
) => {
  // allow only objects of the same parent
  const objectParents = collectObjectParents(objects, movingObjects);
  if (objectParents.length > 1) {
    return false;
  }

  // allow only non-root objects
  if (objectParents.length === 0) {
    return false;
  }

  const parent = first(objectParents)!;

  // no moving between tenants
  if (parent.type === ObjectType.Tenant) {
    return false;
  }

  // allow only draggable objects
  const objectTypes = collectObjectTypes(movingObjects);
  if (intersection(objectTypes, NON_DRAGGABLE_OBJECTS).length) {
    return false;
  }

  // allow moving only into a node with the same child types
  if (!isWithSameChildren(parent.type, dropNode.type)) {
    return false;
  }

  // allow moving only into another parent
  if (parent.type === dropNode.type && parent.id === dropNode.id) {
    return false;
  }

  return true;
};
