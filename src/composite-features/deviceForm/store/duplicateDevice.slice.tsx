import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import { ISelectOption } from "@/common/types";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { addTask } from "@/features/tasks";

import { TDeviceFormValues } from "../models/deviceForm.ts";
import {
  mapDeviceTypesToOptions,
  mapFormValuesToServer,
  mapServerDataToFormValues,
} from "../services/deviceForm.mapper.ts";
import { deviceLoader } from "../services/deviceLoader.service.ts";

export interface IDuplicateDeviceSlice {
  isLoading: boolean;
  isSubmitting: boolean;
  device: TDeviceFormValues;
  deviceTypes: Array<ISelectOption>;
}

const initialState: IDuplicateDeviceSlice = {
  isLoading: false,
  isSubmitting: false,
  device: {
    deviceType: "",
    deviceNumber: undefined,
    isEnabled: false,
    displayName: "",
  },
  deviceTypes: [],
};

export const duplicatedDeviceSlice = createAppSlice({
  name: "duplicateDevice",
  initialState,

  reducers: (create) => ({
    loadData: create.asyncThunk(
      async ({
        routeDevice,
        onError,
      }: {
        routeDevice: IStoreDataNode;
        onError: (errorMessage: string) => void;
      }) => {
        const [
          { data: device, error: deviceError },
          { data: deviceTypes, error: deviceTypesError },
        ] = await Promise.all([
          deviceLoader.getDevice(routeDevice),
          deviceLoader.getAvailableDeviceTypes(),
        ]);

        const error = deviceError || deviceTypesError;
        if (error) {
          onError(error);
          return {};
        }
        return { device, deviceTypes };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload: { device, deviceTypes } }) => {
          state.device = mapServerDataToFormValues(device || {});
          state.deviceTypes = mapDeviceTypesToOptions(deviceTypes || []);
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    createDevice: create.asyncThunk(
      async (
        {
          shopId,
          tenantId,
          values,
          onSuccess,
          onError,
        }: {
          shopId: string;
          tenantId: string;
          values: TDeviceFormValues;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const deviceData = mapFormValuesToServer(values, shopId, tenantId);
        const { response, error } = await deviceLoader.createDevice(deviceData);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("device.tasks.addDevice", {
                  name: values.displayName,
                }),
                changeInfo: response,
              }),
            );
          }
          onSuccess();
        }
      },
      {
        pending: (state) => {
          state.isSubmitting = true;
        },
        settled: (state) => {
          state.isSubmitting = false;
        },
      },
    ),
  }),

  selectors: {
    selectDevice: (state) => state.device,
    selectDeviceTypes: (state) => state.deviceTypes,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
  },
});

export const { loadData, createDevice } = duplicatedDeviceSlice.actions;
export const {
  selectDevice,
  selectDeviceTypes,
  selectIsLoading,
  selectIsSubmitting,
} = duplicatedDeviceSlice.selectors;
