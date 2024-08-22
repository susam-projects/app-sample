import i18n from "@/common/i18n";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { companyApi, ICompanyData } from "@/features/company";

export const companyDataLoader = {
  async getCompany(routeObject: IStoreDataNode) {
    try {
      const response = await companyApi.getByLinks(routeObject.selfLinks || []);
      if (response?.status === 200 && response.data) {
        return { data: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("company.error.loadingCompany") };
  },

  async createCompany(data: ICompanyData) {
    try {
      const response = await companyApi.create(data);
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("company.error.creatingCompany") };
  },

  async updateCompany(routeObject: IStoreDataNode, data: ICompanyData) {
    try {
      const response = await companyApi.updateByLinks(
        routeObject.selfLinks || [],
        data,
      );
      if (response?.status === 200 && response.data) {
        return { response: response.data };
      }
    } catch {
      /* empty */
    }
    return { error: i18n.t("company.error.updatingCompany") };
  },
};
