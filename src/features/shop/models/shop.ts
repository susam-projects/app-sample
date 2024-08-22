import { IEntityData, IHATEOASItem } from "@/common/api";
export interface IShopResponse extends IHATEOASItem {
  completeDisplayName?: string;
  shortDisplayName?: string;
  shopCode?: string;
  adherentCode?: string;
  thirdPartyCode?: string;
  idCompany?: string; // companyId
  idReplicationSite?: string; // replicationSiteId
  idBrand?: string | null;
  idLogicalStockGroup?: string | null;
  closingPeriods?: Array<Partial<IClosingPeriod>>;
}

export interface ICreateOrUpdateShopRequest extends IEntityData {
  idShop: string | null;
  displayName: string | null;
  enabled?: boolean;
  completeDisplayName: string | null;
  shortDisplayName: string | null;
  shopCode: string | null;
  adherentCode: string | null;
  thirdPartyCode: string | null;
  idTenant: string | null;
  idCompany: string | null;
  idReplicationSite: string | null;
  idChain: string | null;
  idBrand: string | null;
  idLogicalStockGroup: string | null;
}

export interface IClosingPeriod {
  start: string;
  end: string;
}

export interface IForceSynchronizationData extends IEntityData {
  idTenant?: string;
  idShop?: string;
}
