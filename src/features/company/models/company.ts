import { IEntityData, IHATEOASItem } from "@/common/api";

export interface ICompanyResponse extends IHATEOASItem {
  financialYearEnd?: string;
}

export interface ICompanyData extends IEntityData {
  idCompany?: string;
  idTenant?: string;
  displayName?: string;
  enabled?: boolean;
  iconUrl?: string;
  financialYearEnd?: string;
}
