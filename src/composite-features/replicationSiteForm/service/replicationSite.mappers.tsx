import { entityUserInfo } from "@/feature-blocks/userInfo";
import {
  ICreateOrUpdateReplicationSiteRequest,
  IReplicationSiteResponse,
  ReplicationSiteTypes,
  IForceSynchronizationData,
} from "@/features/replicationSite";

import {
  TEditReplicationSiteFormValues,
  TReplicationSiteFormValues,
} from "../models/replicationSite";

export const ReplicationSiteMappers = {
  mapReplicationSiteDataToServer: (
    values: TReplicationSiteFormValues,
    tenantId: string,
    chainId: string | null,
    replicationSiteId?: string,
  ): Partial<ICreateOrUpdateReplicationSiteRequest> => {
    return {
      ...entityUserInfo.getUserData(),
      idReplicationSite: replicationSiteId || null,
      displayName: values.displayName,
      thirdPartyCode: values.thirdPartyCode,
      startReplicationRange: values.startReplicationRange,
      endReplicationRange: values.endReplicationRange,
      maxToken: values.maxToken,
      mainShop: values.mainShop,
      idChain: chainId,
      replicationSiteIdentifier: null,
      replicationSender: values.sender,
      replicationGuid: values.guId || null,
      idTenant: tenantId,
      type: values.siteType,
      versionIdStart: values.versionIdStart || null,
      versionIdEnd: values.versionIdEnd || null,
    };
  },

  mapDataFromServer: (
    data: IReplicationSiteResponse,
  ): Partial<TEditReplicationSiteFormValues> => {
    const isSiteTypeValid = Object.values(ReplicationSiteTypes).includes(
      data.type as ReplicationSiteTypes,
    );
    return {
      displayName: data.displayName || "",
      guId: data.replicationGuid || "",
      baseId: data.objectId,
      genVersion: undefined,
      siteType: isSiteTypeValid ? data.type : ReplicationSiteTypes.Server,
      mainShop: data.mainShop || "",
      thirdPartyCode: data.thirdPartyCode || "",
      startReplicationRange: data.startReplicationRange,
      endReplicationRange: data.endReplicationRange,
      maxToken: data.maxToken,
      sender: data.replicationSender || "",
      versionIdStart: data.versionIdStart,
      versionIdEnd: data.versionIdEnd,
    };
  },

  toForceSynchronizationData: (
    tenantId: string,
    replicationSiteId: string,
  ): IForceSynchronizationData => {
    return {
      ...entityUserInfo.getUserData(),
      idTenant: tenantId,
      idReplicationSite: replicationSiteId,
    };
  },
};
