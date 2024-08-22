import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { entityUserInfo } from "@/feature-blocks/userInfo";
import {
  IForceSynchronizationData,
  ITenantData,
  ITenantResponse,
} from "@/features/tenant";

import {
  TEditTenantFormValues,
  TTenantFormValues,
} from "../models/tenantForm.ts";

export const mapDataFromServer = (
  data: ITenantResponse,
): TEditTenantFormValues => {
  return {
    displayName: data.displayName || "",
    originalName: "",
    technicalName: "",
    containerName: data.containerName || "",
    template: data.template || "",
    databaseVersion: data.databaseVersion || "",
    containerUrl: data.containerUrl || "",
    containerSize: data.containerSize || "",
    tag: [],
    tenantId: undefined,
    tenantSecret: undefined,
    chain: data.idChain || "",
  };
};

export const mapDataToServer = ({
  values,
  tenantId,
  routeServer,
}: {
  values: TTenantFormValues;
  tenantId?: string;
  routeServer?: IStoreDataNode;
}): Partial<ITenantData> => {
  return {
    ...entityUserInfo.getUserData(),
    idTenant: tenantId,
    idChain: values.chain,
    displayName: values.displayName,
    containerUrl: values.containerUrl,
    masterNodeDetails: routeServer && {
      databaseUrl: routeServer.title,
    },
    template: values.template || undefined,
    databaseVersion: values.databaseVersion || undefined,
  };
};

export const toForceSynchronizationData = (
  tenantId: string,
): IForceSynchronizationData => {
  return {
    ...entityUserInfo.getUserData(),
    idTenant: tenantId,
  };
};
