import { z } from "zod";

import { IEntityData, IHATEOASItem } from "@/common/api";
import i18n from "@/common/i18n";
import { ISelectOption } from "@/common/types";

export enum ReplicationSiteTypes {
  Lame = "Lame",
  Server = "Server",
  BackupServer = "BackupServer",
  Laptop = "Laptop",
  SynchroLaptop = "SynchroLaptop",
  BackupCashing = "BackupCashing",
  MasterNode = "MasterNode",
  GinkoNect = "GinkoNect",
}

export const ReplicationSiteTypesEnum = z.nativeEnum(ReplicationSiteTypes, {
  required_error: i18n.t("common.form.error.required"),
});

export type ReplicationSiteTypesType = z.infer<typeof ReplicationSiteTypesEnum>;

export const siteTypesOptions: ISelectOption[] = [
  { label: "Lame", value: ReplicationSiteTypes.Lame },
  { label: "Server", value: ReplicationSiteTypes.Server },
  { label: "Backup Server", value: ReplicationSiteTypes.BackupServer },
  { label: "Laptop", value: ReplicationSiteTypes.Laptop },
  { label: "Synchro Laptop", value: ReplicationSiteTypes.SynchroLaptop },
  { label: "Backup Cashing", value: ReplicationSiteTypes.BackupCashing },
  { label: "Master Node", value: ReplicationSiteTypes.MasterNode },
  { label: "Ginko Nect", value: ReplicationSiteTypes.GinkoNect },
];

export interface IReplicationSiteResponse extends IHATEOASItem {
  endReplicationRange?: number;
  idChain?: string;
  idTenant?: string;
  mainShop?: string;
  maxToken?: number;
  replicationGuid?: string;
  replicationSender?: string;
  startReplicationRange?: number;
  thirdPartyCode?: string;
  type?: ReplicationSiteTypesType;
  versionIdEnd?: number;
  versionIdStart?: number;
}

export interface ICreateOrUpdateReplicationSiteRequest extends IEntityData {
  idReplicationSite: string | null;
  displayName: string | null;
  enabled?: boolean;
  thirdPartyCode: string | null;
  startReplicationRange: number | null;
  endReplicationRange: number | null;
  maxToken: number | null;
  mainShop: string | null;
  idChain: string | null;
  replicationSiteIdentifier: number | null;
  replicationSender: string | null;
  replicationGuid: string | null;
  idTenant: string | null;
  type: ReplicationSiteTypesType;
  versionIdStart: number | null;
  versionIdEnd: number | null;
}

export interface IForceSynchronizationData extends IEntityData {
  idTenant?: string;
  idReplicationSite?: string;
}
