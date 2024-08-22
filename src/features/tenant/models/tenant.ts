import { IEntityData, IHATEOASItem } from "@/common/api";

export interface ITenantResponse extends IHATEOASItem {
  idCurrency?: string;
  idChain?: string;
  idGinkoiaTools?: string;
  hasMasterNode?: boolean;
  containerUrl?: string;
  containerName?: string;
  containerSize?: string;
  template?: string;
  databaseVersion?: string;
}

export interface ITenantData extends IEntityData {
  idTenant?: string;
  idChain: string;
  idCurrency: string;
  displayName: string;
  tenantType?: string;
  idGinkoiaTools?: number;
  containerUrl: string;
  masterNodeDetails?: {
    databaseUrl?: string;
    databaseName?: string;
    databaseSchema?: string;
    databaseUser?: string;
    databasePassword?: string;
  };
  handleDataConsistency?: boolean;
  handleCredentials?: boolean;
  containerSize?: string;
  template: string;
  databaseVersion: string;
}

export interface IForceSynchronizationData extends IEntityData {
  idTenant?: string;
}
