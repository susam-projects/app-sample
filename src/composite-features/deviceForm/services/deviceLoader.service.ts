import i18n from "@/common/i18n";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { IDeviceData } from "@/features/device";
import { deviceApi } from "@/features/device/api/device.api.ts";

export const deviceLoader = {
  async getDevice(routeObject: IStoreDataNode) {
    try {
      const response = await deviceApi.getByLinks(routeObject.selfLinks || []);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("device.error.loadingDevice") };
  },

  async getAvailableDeviceTypes() {
    try {
      const response = await deviceApi.getDeviceTypes();
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("device.error.loadingTypes") };
  },

  async createDevice(data: IDeviceData) {
    try {
      const response = await deviceApi.create(data);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("device.error.creatingDevice") };
  },

  async updateDevice(routeObject: IStoreDataNode, data: IDeviceData) {
    try {
      const response = await deviceApi.updateByLinks(
        routeObject.selfLinks || [],
        data,
      );
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("device.error.updatingDevice") };
  },
};
