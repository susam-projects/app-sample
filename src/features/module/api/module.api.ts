import {
  apiClient,
  getDisableItemLink,
  getEnableItemLink,
  IChangeResponse,
  IHATEOASLink,
} from "@/common/api";
import { IModuleRequest } from "@/features/module";

class ModuleApi {
  private _baseUrl = "/module";

  enableModule(links: IHATEOASLink[], data: IModuleRequest) {
    const enableItemLink = getEnableItemLink(links);
    return apiClient.request<IChangeResponse>({
      url: enableItemLink?.href || this._baseUrl,
      method: enableItemLink?.method || "POST",
      data,
    });
  }

  disableModule(links: IHATEOASLink[], data: IModuleRequest) {
    const disableItemLink = getDisableItemLink(links);
    return apiClient.request<IChangeResponse>({
      url: disableItemLink?.href || this._baseUrl,
      method: disableItemLink?.method || "PUT",
      data,
    });
  }
}

export const moduleApi = new ModuleApi();
