import { apiClient, getGetLink, getUpdateLink } from "@/common/api";

export interface IHATEOASItem {
  objectId?: string;
  objectType?: string;
  displayName?: string;
  enabled?: boolean;
  iconUrl?: string;
  links?: IHATEOASLink[];
  items?: IHATEOASChildren[];
  historicalActions?: IHistoryAction[];
}

export interface IHATEOASChildren {
  itemsType?: string;
  iconUrl?: string;
  items?: IHATEOASItem[];
}

export interface IHATEOASLink {
  rel?: string;
  method?: string;
  href?: string;
}

export interface IHistoryAction {
  date: string;
  user: string;
  historicalActionType: string;
  detail: string;
}

export const enum RelType {
  GetItemList = "GetItemList",
  GetItem = "GetItem",
  CreateItem = "CreateItem",
  UpdateItem = "UpdateItem",
  DisableItem = "DisableItem",
  EnableItem = "EnableItem",
}

export class HalApi {
  getItemByLinks(links: IHATEOASLink[]) {
    const getLink = getGetLink(links);
    if (!getLink?.href) {
      return Promise.resolve(undefined);
    }
    return apiClient.request<IHATEOASItem>({
      url: getLink.href,
      method: getLink.method || "GET",
    });
  }

  updateItemByLinks(links: IHATEOASLink[], data: IHATEOASItem) {
    const updateLink = getUpdateLink(links);
    if (!updateLink?.href) {
      return Promise.resolve(undefined);
    }
    return apiClient.request<IHATEOASItem>({
      url: updateLink.href,
      method: updateLink.method || "PUT",
      data,
    });
  }
}
