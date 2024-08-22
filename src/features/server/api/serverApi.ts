import { apiClient, EntityApi } from "@/common/api";

import { IServer } from "../models/server.ts";

class ServerApi extends EntityApi<IServer> {
  constructor() {
    super("/server");
  }

  getAll<TData = IServer[]>() {
    return apiClient.get<TData>(`/server/list`);
  }
}

export const serverApi = new ServerApi();
