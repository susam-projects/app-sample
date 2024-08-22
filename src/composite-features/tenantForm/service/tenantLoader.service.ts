import i18n from "@/common/i18n";
import { chainApi } from "@/feature-blocks/chain";
import { containerSizeApi } from "@/feature-blocks/containerSize";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import {
  IForceSynchronizationData,
  ITenantData,
  tenantApi,
} from "@/features/tenant";

export const tenantLoader = {
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

  async getAvailableTemplates() {
    try {
      const response = await tenantApi.getTemplateList();
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.loadingTemplates") };
  },

  async getAvailableDatabaseVersions() {
    try {
      const response = await tenantApi.getDatabaseVersionList();
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.loadingDatabaseVersions") };
  },

  async getAvailableContainerSizes() {
    try {
      const response = await containerSizeApi.getAll();
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.loadingContainerSizes") };
  },

  async getAvailableTags() {
    await Promise.resolve();
    return { error: i18n.t("tenant.error.loadingTags") };
  },

  async getAvailableChains() {
    try {
      const response = await chainApi.getAll();
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.loadingContainerSizes") };
  },

  async createTenant(data: Partial<ITenantData>) {
    // TODO: try to use HATEOAS link here

    try {
      const response = await tenantApi.create(data);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.creatingTenant") };
  },

  async updateTenant(routeObject: IStoreDataNode, data: Partial<ITenantData>) {
    try {
      const response = await tenantApi.updateByLinks(
        routeObject.selfLinks || [],
        data,
      );
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("tenant.error.updatingTenant") };
  },

  async forceSynchronization(data: Partial<IForceSynchronizationData>) {
    try {
      const response = await tenantApi.forceSynchronization(data);
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
