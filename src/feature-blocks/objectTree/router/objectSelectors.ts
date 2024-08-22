import first from "lodash/first";

import { useAppSelector } from "@/app/store";

import {
  selectAncestor,
  selectChildren,
  selectObjects,
  selectParent,
  selectRouteObjectKeys,
} from "../store/objectTree.slice.ts";
import { ObjectType } from "../types/objectTreeTypes.ts";

export const useRouteObjects = () => {
  const objectKeys = useAppSelector(selectRouteObjectKeys);
  return useAppSelector((state) => selectObjects(state, objectKeys));
};

export const useRouteObject = () => {
  const objects = useRouteObjects();
  return first(objects);
};

export const useRouteObjectParent = () => {
  const objectKeys = useAppSelector(selectRouteObjectKeys);
  const childKey = first(objectKeys);
  return useAppSelector((state) => selectParent(state, childKey)) || undefined;
};

export const useRouteObjectAncestor = ({ type }: { type: ObjectType }) => {
  const objectKeys = useAppSelector(selectRouteObjectKeys);
  const descendantKey = first(objectKeys);
  return useAppSelector((state) => selectAncestor(state, descendantKey, type));
};

export const useRouteObjectSiblings = (params?: { type: ObjectType }) => {
  const parent = useRouteObjectParent();
  const siblings = useAppSelector((state) =>
    selectChildren(state, parent, params?.type),
  );

  return { parent, siblings };
};

export const useRouteObjectSiblingsByAncestor = ({
  type,
  ancestorType,
}: {
  type: ObjectType;
  ancestorType: ObjectType;
}) => {
  const ancestor = useRouteObjectAncestor({ type: ancestorType });
  const siblings = useAppSelector((state) =>
    selectChildren(state, ancestor, type),
  );

  return { ancestor, siblings };
};

export const useRouteObjectChildren = (params?: { type: ObjectType }) => {
  const object = useRouteObject();
  const children = useAppSelector((state) =>
    selectChildren(state, object, params?.type),
  );

  return { object, children };
};
