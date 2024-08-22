import {
  EntityApi,
  IChangeResponse,
  IEntityData,
  IHATEOASItem,
} from "@/common/api";

export interface IPostLogicalStockGroupData extends IEntityData {
  displayName: string;
  idTenant: string;
}

export class LogicalStockGroupApi extends EntityApi<
  IHATEOASItem,
  IPostLogicalStockGroupData,
  IChangeResponse
> {
  constructor() {
    super("/logicalStockGroup");
  }
}

export const logicalStockGroupApi = new LogicalStockGroupApi();
