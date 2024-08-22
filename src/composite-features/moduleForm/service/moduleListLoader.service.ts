import i18n from "@/common/i18n";
import { shopApi } from "@/features/shop";

export const moduleListLoader = {
  async getTenantShops(tenantId: string) {
    try {
      const response = await shopApi.getAllByTenantId(tenantId);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("shop.error.loadingShop") };
  },
};
