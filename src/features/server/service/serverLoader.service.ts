import i18n from "@/common/i18n";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { serverApi } from "@/features/server";

export const serverLoader = {
  async getServer(routeObject: IStoreDataNode) {
    try {
      const response = await serverApi.getByLinks(routeObject.selfLinks || []);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }

    return { error: i18n.t("server.error.loading") };
  },
};
