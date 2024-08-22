import { ROOT_OBJECT } from "../constants/objectTree.constants.ts";
import { ObjectType, TObjectTreeData } from "../types/objectTreeTypes.ts";

export const TEST_LOADED_KEYS = [
  "root-/server-1",
  "root-/server-2",
  "root-/server-1/tenant-1",
  "root-/server-1/tenant-2",
  "root-/server-1/tenant-1/replicationsite-0",
  "root-/server-1/tenant-1/replicationsite-1",
  "root-/server-1/tenant-1/replicationsite-2",
  "root-/server-1/tenant-1/company-1",
  "root-/server-1/tenant-1/company-2",
  "root-/server-1/tenant-1/company-1/shop-3",
  "root-/server-1/tenant-1/replicationsite-2/shop-1",
  "root-/server-1/tenant-1/replicationsite-2/shop-2",
  "root-/server-1/tenant-1/replicationsite-2/shop-2/device-1",
  "root-/server-1/tenant-1/replicationsite-2/shop-2/device-2",
  "root-/server-1/tenant-1/replicationsite-2/shop-2/module-1",
  "root-/server-1/tenant-1/replicationsite-2/shop-2/module-2",
];

export const TEST_DATA: TObjectTreeData = {
  [ObjectType.Root]: {
    [ROOT_OBJECT.id]: {
      ...ROOT_OBJECT,
      children: [
        { id: "1", type: ObjectType.Server },
        { id: "2", type: ObjectType.Server },
      ],
    },
  },
  [ObjectType.Server]: {
    "1": {
      id: "1",
      type: ObjectType.Server,
      title: "Server 1",
      isEnabled: true,
      children: [
        { type: ObjectType.Tenant, id: "1" },
        { type: ObjectType.Tenant, id: "2" },
      ],
    },
    "2": {
      id: "2",
      type: ObjectType.Server,
      title: "Server 2",
      children: undefined,
    },
  },
  [ObjectType.Tenant]: {
    "1": {
      id: "1",
      type: ObjectType.Tenant,
      title: "Tenant 1",
      isEnabled: true,
      children: [
        { type: ObjectType.ReplicationSite, id: "0" },
        { type: ObjectType.ReplicationSite, id: "1" },
        { type: ObjectType.ReplicationSite, id: "2" },
        { type: ObjectType.Company, id: "1" },
        { type: ObjectType.Company, id: "2" },
      ],
    },
    "2": {
      id: "2",
      type: ObjectType.Tenant,
      title: "Tenant 2",
      isEnabled: true,
      children: undefined,
    },
  },
  [ObjectType.ReplicationSite]: {
    "0": {
      id: "0",
      type: ObjectType.ReplicationSite,
      title: "Master Node",
      isEnabled: true,
      children: undefined,
    },
    "1": {
      id: "1",
      type: ObjectType.ReplicationSite,
      title: "Replication Node 1",
      isEnabled: true,
      children: undefined,
    },
    "2": {
      id: "2",
      type: ObjectType.ReplicationSite,
      title: "Replication Node 2",
      isEnabled: true,
      children: [
        { type: ObjectType.Shop, id: "1" },
        { type: ObjectType.Shop, id: "2" },
      ],
    },
  },
  [ObjectType.Company]: {
    "1": {
      id: "1",
      type: ObjectType.Company,
      title: "Company 1",
      isEnabled: true,
      children: [{ type: ObjectType.Shop, id: "3" }],
    },
    "2": {
      id: "2",
      type: ObjectType.Company,
      title: "Company 2",
      isEnabled: true,
      children: undefined,
    },
  },
  [ObjectType.Shop]: {
    "1": {
      id: "1",
      type: ObjectType.Shop,
      title: "Shop 1",
      isEnabled: true,
      children: undefined,
    },
    "2": {
      id: "2",
      type: ObjectType.Shop,
      title: "Shop 2",
      isEnabled: true,
      children: [
        { type: ObjectType.Device, id: "1" },
        { type: ObjectType.Device, id: "2" },
        { type: ObjectType.Module, id: "1" },
        { type: ObjectType.Module, id: "2" },
      ],
    },
    "3": {
      id: "3",
      type: ObjectType.Shop,
      title: "Shop 3",
      isEnabled: true,
      children: undefined,
    },
  },
  [ObjectType.Device]: {
    "1": {
      id: "1",
      type: ObjectType.Device,
      title: "Device 1",
      isEnabled: true,
      children: undefined,
    },
    "2": {
      id: "2",
      type: ObjectType.Device,
      title: "Device 2",
      isEnabled: true,
      children: undefined,
    },
  },
  [ObjectType.Module]: {
    "1": {
      id: "1",
      type: ObjectType.Module,
      title: "Module 1",
      isEnabled: true,
      children: undefined,
    },
    "2": {
      id: "2",
      type: ObjectType.Module,
      title: "Module 2",
      isEnabled: true,
      children: undefined,
    },
  },
};
