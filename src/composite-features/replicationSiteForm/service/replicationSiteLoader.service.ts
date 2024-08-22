import i18n from "@/common/i18n";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import {
  ICreateOrUpdateReplicationSiteRequest,
  IForceSynchronizationData,
  replicationSiteApi,
} from "@/features/replicationSite";
import { shopApi } from "@/features/shop";
import { tenantApi } from "@/features/tenant";

export const replicationSiteDataLoader = {
  async getReplicationSite(routeObject: IStoreDataNode) {
    try {
      const response = await replicationSiteApi.getByLinks(
        routeObject.selfLinks || [],
      );
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("replicationSite.error.loadingReplicationSite") };
  },

  async createReplicationSite(
    data: Partial<ICreateOrUpdateReplicationSiteRequest>,
  ) {
    try {
      const response = await replicationSiteApi.create(data);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("replicationSite.error.creatingReplicationSite") };
  },

  async updateReplicationSite(
    routeObject: IStoreDataNode,
    data: Partial<ICreateOrUpdateReplicationSiteRequest>,
  ) {
    try {
      const response = await replicationSiteApi.updateByLinks(
        routeObject.selfLinks || [],
        data,
      );
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("replicationSite.error.updatingReplicationSite") };
  },

  async getTenant(routeObject: IStoreDataNode) {
    try {
      const response = await tenantApi.getByLinks(routeObject.selfLinks || []);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.loadingTenant") };
  },

  async getShopList(tenantId: string) {
    try {
      const response = await shopApi.getAllByTenantId(tenantId);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.loadingShop") };
  },

  async forceSynchronization(data: Partial<IForceSynchronizationData>) {
    try {
      const response = await replicationSiteApi.forceSynchronization(data);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return {
      error: i18n.t("forceSynchronization.error"),
    };
  },
};
