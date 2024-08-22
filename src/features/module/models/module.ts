import { IEntityData } from "@/common/api";

export interface IModuleRequest extends IEntityData {
  idModule: string;
  idShop: string;
  idTenant: string;
  enabled: boolean;
}
