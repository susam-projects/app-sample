import { IHATEOASItem, IHATEOASLink } from "@/common/api";

import { objectTreeApi } from "../api/objectTree.api.ts";
import {
  ERROR_FILTERING_OBJECT_TREE,
  ERROR_LOADING_CHILDREN,
  ERROR_LOADING_OBJECT,
  ERROR_LOADING_SERVERS_LIST,
  ERROR_UPDATING_OBJECT,
} from "../constants/objectTree.errors.ts";

export const treeDataLoader = {
  async getServerList() {
    try {
      const response = await objectTreeApi.getServerList();
      if (response?.status === 200) {
        return { data: response.data || [] };
      }
    } catch {
      /* empty */
    }

    return { error: ERROR_LOADING_SERVERS_LIST };
  },

  async searchObjects(searchValue: string, tag: string | null) {
    try {
      const response = await objectTreeApi.search(searchValue, tag);
      if (response?.status === 200) {
        return { data: response.data || [] };
      }
    } catch {
      /* empty */
    }

    return { error: ERROR_FILTERING_OBJECT_TREE };
  },

  async getChildrenByParentLinks(links: IHATEOASLink[]) {
    try {
      const response = await objectTreeApi.getItemByLinks(links);
      if (response?.status === 200) {
        return { data: response?.data?.items || [] };
      }
    } catch {
      /* empty */
    }

    return { error: ERROR_LOADING_CHILDREN };
  },

  async getObjectByLinks(links: IHATEOASLink[]) {
    try {
      const response = await objectTreeApi.getItemByLinks(links);
      if (response?.status === 200) {
        return { data: response?.data };
      }
    } catch {
      /* empty */
    }

    return { error: ERROR_LOADING_OBJECT };
  },

  async updateObject(links: IHATEOASLink[], object: IHATEOASItem) {
    try {
      const response = await objectTreeApi.updateItemByLinks(links, object);
      if (response?.status === 200) {
        return { data: response?.data };
      }
    } catch {
      /* empty */
    }

    return { error: ERROR_UPDATING_OBJECT };
  },
};
