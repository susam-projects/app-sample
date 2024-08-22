import { apiClient } from "./apiClient.ts";
import { IHATEOASLink } from "./halApi.ts";
import { getCreateLink, getGetLink, getUpdateLink } from "./halUtils.ts";

export interface IEntityData {
  userFirstname: string;
  userLastname: string;
}

export interface IChangeResponse {
  webhookUrl: string;
  subscriptionName: string;
  idAction: string;
}

export class EntityApi<
  TGetData,
  TRequestData = TGetData,
  TChangeResponse = IChangeResponse,
> {
  constructor(protected _baseUrl: string) {}

  getAllByTenantId<T = TGetData>(tenantId: string) {
    return apiClient.get<T[]>(`${this._baseUrl}`, {
      params: { idTenant: tenantId },
    });
  }

  getAll<T = TGetData>() {
    return apiClient.get<T[]>(`${this._baseUrl}`);
  }

  getById<T = TGetData>(id: string) {
    return apiClient.get<T>(`${this._baseUrl}/${id}`);
  }

  getByLinks<T = TGetData>(links: IHATEOASLink[]) {
    const getLink = getGetLink(links);
    if (!getLink?.href) {
      return Promise.resolve(undefined);
    }
    return apiClient.request<T>({
      url: getLink.href,
      method: getLink.method || "GET",
    });
  }

  create<T = TRequestData, U = TChangeResponse>(data: Partial<T>) {
    return apiClient.post<U>(this._baseUrl, data);
  }

  createByLinks<T = TRequestData, U = TChangeResponse>(
    links: IHATEOASLink[],
    data: Partial<T>,
  ) {
    const createLink = getCreateLink(links);
    if (!createLink?.href) {
      return Promise.resolve(undefined);
    }
    return apiClient.request<U>({
      url: createLink.href,
      method: createLink.method || "POST",
      data,
    });
  }

  updateByLinks<T = TRequestData, U = TChangeResponse>(
    links: IHATEOASLink[],
    data: Partial<T>,
  ) {
    const updateLink = getUpdateLink(links);
    if (!updateLink?.href) {
      return Promise.resolve(undefined);
    }
    return apiClient.request<U>({
      url: updateLink.href,
      method: updateLink.method || "PUT",
      data,
    });
  }
}
