import { entityUserInfo } from "@/feature-blocks/userInfo";
import {
  ICreateOrUpdateShopRequest,
  IForceSynchronizationData,
  IShopResponse,
} from "@/features/shop";
import { ITenantResponse } from "@/features/tenant";

import { TCreateShopFormValues, TEditShopFormValues } from "../models/shop";

export const ShopMappers = {
  mapEditShopDataToServer: (
    values: TEditShopFormValues,
    shopId: string,
    tenantId: string,
  ): Partial<ICreateOrUpdateShopRequest> => {
    return {
      ...entityUserInfo.getUserData(),
      idShop: shopId,
      displayName: values.displayName,
      completeDisplayName: values.completeDisplayName,
      shortDisplayName: values.shortDisplayName,
      shopCode: values.shopCode || null,
      adherentCode: values.adherentCode,
      thirdPartyCode: values.thirdPartyCode,
      idTenant: tenantId,
      idCompany: values.company,
      idReplicationSite: values.replicationSite,
      idChain: values.chain,
      idBrand: null,
      idLogicalStockGroup: values.pumpGroup,
    };
  },

  mapAddShopDataToServer: (
    values: TCreateShopFormValues,
    tenantId: string,
  ): Partial<ICreateOrUpdateShopRequest> => {
    return {
      ...entityUserInfo.getUserData(),
      idShop: null,
      displayName: values.displayName,
      completeDisplayName: values.completeDisplayName,
      shortDisplayName: values.shortDisplayName,
      shopCode: null,
      adherentCode: values.adherentCode,
      thirdPartyCode: values.thirdPartyCode,
      idTenant: tenantId,
      idCompany: values.company,
      idReplicationSite: values.replicationSite,
      idChain: values.chain,
      idBrand: values.storeSign,
      idLogicalStockGroup: values.pumpGroup,
    };
  },

  mapDataFromServer: (
    data: IShopResponse,
    tenantData: ITenantResponse,
  ): Partial<TEditShopFormValues> => {
    return {
      replicationSite: data.idReplicationSite || "",
      company: data.idCompany || "",
      displayName: data.displayName || "",
      completeDisplayName: data.completeDisplayName || "",
      shortDisplayName: data.shortDisplayName || "",
      pumpGroup: data.idLogicalStockGroup || "",
      chain: tenantData.idChain || "",
      shopCode: data.shopCode || "",
      adherentCode: data.adherentCode || "",
      thirdPartyCode: data.thirdPartyCode || "",
      closingPeriods: (data.closingPeriods || []).map((period) => ({
        start: period?.start || "",
        end: period?.end || "",
      })),
    };
  },

  toForceSynchronizationData: (
    tenantId: string,
    shopId: string,
  ): IForceSynchronizationData => {
    return {
      ...entityUserInfo.getUserData(),
      idTenant: tenantId,
      idShop: shopId,
    };
  },
};
