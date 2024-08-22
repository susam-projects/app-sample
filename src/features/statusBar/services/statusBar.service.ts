import { IStoreDataNode } from "@/feature-blocks/objectTree";

import {
  IReplicationSiteInfo,
  IShopInfo,
  ITenantInfo,
} from "../types/statusBarInfo.ts";

export const getTenantInfo = (tenant?: IStoreDataNode): ITenantInfo | null => {
  if (!tenant) {
    return null;
  }

  return {
    id: tenant.id || "",
    name: tenant.title || "",
    isEnabled: !!tenant.isEnabled,
    tags: ["tag_1"],
    companiesCount: 0,
    replicationSitesCount: 0,
    shopsCount: 0,
    devicesCount: 0,
  };
};

export const getReplicationSiteInfo = (
  replicationSite?: IStoreDataNode,
): IReplicationSiteInfo | null => {
  if (!replicationSite) {
    return null;
  }

  return {
    id: replicationSite.id || "",
    name: replicationSite.title || "",
    tierCode: "-",
    genVersion: "-",
  };
};

export const getShopInfo = (shop?: IStoreDataNode): IShopInfo | null => {
  if (!shop) {
    return null;
  }

  return {
    id: shop.id || "",
    name: shop.title || "",
    isEnabled: !!shop.isEnabled,
    tags: [
      "tag_with_a_very_very_very_very_very_very_very_very_very_very_very_very_long_name_s1",
      "tag_s2",
      "tag_s3",
    ],
    tiersCode: "-",
    adhCode: "-",
  };
};
