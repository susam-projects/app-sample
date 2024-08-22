import { IStoreDataNode, ObjectType } from "../types/objectTreeTypes.ts";

export const ROOT_OBJECT: IStoreDataNode = {
  id: "",
  type: ObjectType.Root,
  title: "",
  children: undefined,
} as const;
