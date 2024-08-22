import i18n from "@/common/i18n";
import { brandApi } from "@/feature-blocks/brand";
import { chainApi } from "@/feature-blocks/chain";
import {
  IPostLogicalStockGroupData,
  logicalStockGroupApi,
} from "@/feature-blocks/logicalStockGroup";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import {
  ICreateOrUpdateShopRequest,
  IForceSynchronizationData,
  shopApi,
} from "@/features/shop";
import { tenantApi } from "@/features/tenant";

export const shopDataLoader = {
  async getShop(routeObject: IStoreDataNode) {
    try {
      const response = await shopApi.getByLinks(routeObject.selfLinks || []);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.loadingShop") };
  },

  async getBrandList(tenantId: string) {
    try {
      const response = await brandApi.getAllByTenantId(tenantId);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.loadingBrandList") };
  },

  async getChainList(tenantId: string) {
    try {
      const response = await chainApi.getAllByTenantId(tenantId);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.loadingChainList") };
  },

  async getLogicalStockGroupList(tenantId: string) {
    try {
      const response = await logicalStockGroupApi.getAllByTenantId(tenantId);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return {
      error: i18n.t("logicalStockGroup.error.loadingLogicalStockGroup"),
    };
  },

  async createLogicalStockGroup(payload: IPostLogicalStockGroupData) {
    try {
      const response = await logicalStockGroupApi.create(payload);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return {
      error: i18n.t("logicalStockGroup.error.creatingLogicalStockGroup"),
    };
  },

  async createShop(data: Partial<ICreateOrUpdateShopRequest>) {
    try {
      const response = await shopApi.create(data);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.creatingShop") };
  },

  async updateShop(
    routeObject: IStoreDataNode,
    data: Partial<ICreateOrUpdateShopRequest>,
  ) {
    try {
      const response = await shopApi.updateByLinks(
        routeObject.selfLinks || [],
        data,
      );
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.updatingShop") };
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

  async forceSynchronization(data: Partial<IForceSynchronizationData>) {
    try {
      const response = await shopApi.forceSynchronization(data);
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
