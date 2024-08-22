import { apiClient, EntityApi, IChangeResponse } from "@/common/api";

import {
  IForceSynchronizationData,
  IReplicationSiteResponse,
} from "../models/replicationSite";

export class ReplicationSiteApi extends EntityApi<IReplicationSiteResponse> {
  constructor() {
    super("/replicationSite");
  }

  forceSynchronization(data: Partial<IForceSynchronizationData>) {
    return apiClient.post<IChangeResponse>(
      `${this._baseUrl}/forceSynchronization`,
      data,
    );
  }
}

export const replicationSiteApi = new ReplicationSiteApi();
