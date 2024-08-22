import { ISelectOption } from "@/common/types";
import { entityUserInfo } from "@/feature-blocks/userInfo";
import { IDeviceData, IDeviceResponse } from "@/features/device";

import { TDeviceFormValues } from "../models/deviceForm.ts";

export const mapFormValuesToServer = (
  values: TDeviceFormValues,
  shopId: string,
  tenantId: string,
  deviceId?: string,
): IDeviceData => {
  return {
    ...entityUserInfo.getUserData(),
    idDevice: deviceId,
    displayName: values.displayName,
    idShop: shopId,
    idTenant: tenantId,
    type: values.deviceType,
  };
};

export const mapServerDataToFormValues = (
  data: IDeviceResponse,
): TDeviceFormValues => {
  return {
    deviceType: data.type || "",
    displayName: data.displayName || "",
    deviceNumber: data.deviceNumber || 0,
  };
};

export const mapDeviceTypesToOptions = (
  deviceTypes: string[],
): ISelectOption[] => {
  return deviceTypes.map((deviceType) => ({
    value: deviceType,
    label: deviceType,
  }));
};
