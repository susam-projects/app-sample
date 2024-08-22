import { apiClient, EntityApi, IChangeResponse } from "@/common/api";

import {
  IForceSynchronizationData,
  ITenantData,
  ITenantResponse,
} from "../models/tenant.ts";

class TenantApi extends EntityApi<ITenantResponse, ITenantData> {
  constructor() {
    super("/tenant");
  }

  getTemplateList() {
    return apiClient.get<string[]>(`${this._baseUrl}/templatelist`);
  }

  getDatabaseVersionList() {
    return apiClient.get<string[]>(`${this._baseUrl}/databaseversionlist`);
  }

  forceSynchronization(data: Partial<IForceSynchronizationData>) {
    return apiClient.post<IChangeResponse>(
      `${this._baseUrl}/forceSynchronization`,
      data,
    );
  }
}

export const tenantApi = new TenantApi();
