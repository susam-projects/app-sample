import { apiClient, EntityApi, IChangeResponse } from "@/common/api";

import { IForceSynchronizationData, IShopResponse } from "../models/shop.ts";

class ShopApi extends EntityApi<IShopResponse> {
  constructor() {
    super("/shop");
  }

  forceSynchronization(data: Partial<IForceSynchronizationData>) {
    return apiClient.post<IChangeResponse>(
      `${this._baseUrl}/forceSynchronization`,
      data,
    );
  }
}

export const shopApi = new ShopApi();
