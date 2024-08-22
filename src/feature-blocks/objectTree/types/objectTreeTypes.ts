import { ReactNode } from "react";

import { IHATEOASLink } from "@/common/api";

export type TObjectId = string;

export enum ObjectType {
  Unknown = "",
  Root = "root",
  Server = "server",
  Tenant = "tenant",
  ReplicationSite = "replicationsite",
  Company = "company",
  Shop = "shop",
  Device = "device",
  Module = "module",
}

export enum UiObjectType {
  Group = "group",
}

export type TUiNodeType = ObjectType | UiObjectType;

export enum ApiObjectType {
  Server = "Server",
  Tenant = "Tenant",
  ReplicationSite = "ReplicationSite",
  Company = "Company",
  Shop = "Shop",
  Device = "Device",
  Module = "Module",
}

export interface IStoreDataNode {
  id: TObjectId;
  type: ObjectType;
  title: string;
  isEnabled?: boolean;
  iconUrl?: string;
  children: INodeLink[] | undefined;
  selfLinks?: IHATEOASLink[];
}

export interface INodeLink {
  id: string;
  type: ObjectType;
}

export interface IUiDataNode {
  id: TObjectId;
  type: TUiNodeType;
  title: string;
  key: string;
  isDisabled?: boolean;
  icon?: ReactNode;
  isLeaf?: boolean;
  children?: IUiDataNode[];
}

export type TObjectTreeData = Partial<
  Record<ObjectType, Record<TObjectId, IStoreDataNode>>
>;
