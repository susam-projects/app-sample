import { IEntityData, IHATEOASItem } from "@/common/api";

export interface IDeviceResponse extends IHATEOASItem {
  idShop?: string;
  deviceNumber?: number;
  type?: string;
}

export interface IDeviceData extends IEntityData {
  idDevice?: string;
  displayName: string;
  enabled?: boolean;
  idShop: string;
  idTenant: string;
  type: string;
}
