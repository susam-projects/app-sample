import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import { getHistoryItemsFromIHATEOASItem } from "@/common/services";
import { ISelectOption } from "@/common/types";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { THistoryList } from "@/features/history";
import { addTask } from "@/features/tasks";

import { TDeviceFormValues } from "../models/deviceForm.ts";
import {
  mapDeviceTypesToOptions,
  mapFormValuesToServer,
  mapServerDataToFormValues,
} from "../services/deviceForm.mapper.ts";
import { deviceLoader } from "../services/deviceLoader.service.ts";

export interface IEditDeviceSlice {
  isLoading: boolean;
  isSubmitting: boolean;
  device: TDeviceFormValues;
  history: THistoryList;
  deviceTypes: Array<ISelectOption>;
}

const initialState: IEditDeviceSlice = {
  isLoading: false,
  isSubmitting: false,
  device: {
    deviceType: "",
    deviceNumber: undefined,
    isEnabled: false,
    displayName: "",
  },
  history: [],
  deviceTypes: [],
};

export const editDeviceSlice = createAppSlice({
  name: "editDevice",
  initialState,

  reducers: (create) => ({
    loadData: create.asyncThunk(
      async ({
        routeObject,
        onError,
      }: {
        routeObject: IStoreDataNode;
        onError: (errorMessage: string) => void;
      }) => {
        const [
          { data: device, error: deviceError },
          { data: deviceTypes, error: deviceTypesError },
        ] = await Promise.all([
          deviceLoader.getDevice(routeObject),
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
          state.history = getHistoryItemsFromIHATEOASItem(device || {});
          state.deviceTypes = mapDeviceTypesToOptions(deviceTypes || []);
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    updateDevice: create.asyncThunk(
      async (
        {
          shopId,
          tenantId,
          deviceId,
          routeObject,
          values,
          onSuccess,
          onError,
        }: {
          shopId: string;
          tenantId: string;
          deviceId: string;
          routeObject: IStoreDataNode;
          values: TDeviceFormValues;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const deviceData = mapFormValuesToServer(
          values,
          shopId,
          tenantId,
          deviceId,
        );
        const { response, error } = await deviceLoader.updateDevice(
          routeObject,
          deviceData,
        );

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("device.tasks.updateDevice", {
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
    selectDeviceHistory: (state) => state.history,
    selectDeviceTypes: (state) => state.deviceTypes,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
  },
});

export const { loadData, updateDevice } = editDeviceSlice.actions;
export const {
  selectDevice,
  selectDeviceHistory,
  selectDeviceTypes,
  selectIsLoading,
  selectIsSubmitting,
} = editDeviceSlice.selectors;
