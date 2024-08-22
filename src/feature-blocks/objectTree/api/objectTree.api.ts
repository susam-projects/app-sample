import { apiClient, HalApi, IHATEOASItem } from "@/common/api";
import { serverApi } from "@/features/server";

export class ObjectTreeApi extends HalApi {
  getServerList() {
    return serverApi.getAll<IHATEOASItem[]>();
  }

  getItem(itemType: string, itemId: string) {
    return apiClient.get<IHATEOASItem>(`/${itemType}/${itemId}`);
  }

  search(searchValue: string, tag: string | null) {
    // TODO: request the real search data
    console.log(searchValue);
    console.log(tag);
    return serverApi.getAll<IHATEOASItem[]>();
  }
}

export const objectTreeApi = new ObjectTreeApi();
