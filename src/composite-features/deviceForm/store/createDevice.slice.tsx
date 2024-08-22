import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import { ISelectOption } from "@/common/types";
import { addTask } from "@/features/tasks";

import { TDeviceFormValues } from "../models/deviceForm.ts";
import {
  mapDeviceTypesToOptions,
  mapFormValuesToServer,
} from "../services/deviceForm.mapper.ts";
import { deviceLoader } from "../services/deviceLoader.service.ts";

export interface ICreateDeviceSlice {
  isLoading: boolean;
  isSubmitting: boolean;
  deviceTypes: Array<ISelectOption>;
}

const initialState: ICreateDeviceSlice = {
  isLoading: false,
  isSubmitting: false,
  deviceTypes: [],
};

export const createDeviceSlice = createAppSlice({
  name: "createDevice",
  initialState,

  reducers: (create) => ({
    loadData: create.asyncThunk(
      async ({ onError }: { onError: (errorMessage: string) => void }) => {
        const { data: deviceTypes, error: deviceTypesError } =
          await deviceLoader.getAvailableDeviceTypes();

        if (deviceTypesError) {
          onError(deviceTypesError);
          return {};
        }

        return { deviceTypes };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload: { deviceTypes } }) => {
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
    selectDeviceTypes: (state) => state.deviceTypes,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
  },
});

export const { loadData, createDevice } = createDeviceSlice.actions;
export const { selectDeviceTypes, selectIsLoading, selectIsSubmitting } =
  createDeviceSlice.selectors;
