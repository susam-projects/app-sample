import { apiClient, EntityApi } from "@/common/api";

import { IDeviceData, IDeviceResponse } from "../models/device.ts";

class DeviceApi extends EntityApi<IDeviceResponse, IDeviceData> {
  constructor() {
    super("/device");
  }

  getDeviceTypes() {
    return apiClient.get<string[]>(`${this._baseUrl}/typelist`);
  }
}

export const deviceApi = new DeviceApi();
