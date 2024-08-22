import differenceWith from "lodash/differenceWith";

import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import { moduleListLoader } from "@/composite-features/moduleForm/service/moduleListLoader.service.ts";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { addTask } from "@/features/tasks";

import { IModuleListItem } from "../models/formSchema.ts";
import {
  toSimpleModuleData,
  toModuleData,
  toModuleDataWithFixedStatus,
} from "../service/moduleList.mappers.ts";
import { moduleStatusUpdater } from "../service/moduleStatusUpdater.service.ts";

export interface IModuleFormSlice {
  moduleList: Array<IModuleListItem>;
  isLoading: boolean;
  isSubmitting: boolean;
}

const initialState: IModuleFormSlice = {
  moduleList: [],
  isLoading: false,
  isSubmitting: false,
};

export const moduleFormSlice = createAppSlice({
  name: "moduleFormSlice",
  initialState,

  reducers: (create) => ({
    setModulesStatus: create.asyncThunk(
      async (
        {
          tenantId,
          shopId,
          modules,
          status,
          onSuccess,
          onWarning,
          onError,
        }: {
          tenantId: string;
          shopId: string;
          modules: IStoreDataNode[];
          status: boolean;
          onSuccess: () => void;
          onWarning: (message: string) => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const modulesWithWrongStatus = modules.filter(
          (module) => module.isEnabled !== status,
        );
        if (!modulesWithWrongStatus.length) {
          onWarning(i18n.t("module.warning.noModulesToChange"));
          return;
        }

        const moduleData = toModuleDataWithFixedStatus(
          modulesWithWrongStatus,
          status,
        );
        const { okResponses, error } =
          await moduleStatusUpdater.setModuleStatuses(
            tenantId,
            shopId,
            moduleData,
          );

        okResponses.forEach((response) => {
          thunkAPI.dispatch(
            addTask({
              title: i18n.t("module.tasks.updateStatus", {
                name: response.moduleName,
              }),
              changeInfo: response.data,
            }),
          );
        });

        if (error) {
          onError(error);
          return;
        }

        onSuccess();
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

    updateModules: create.asyncThunk(
      async (
        {
          tenantId,
          shopId,
          originalModules,
          prevModules,
          newModules,
          onSuccess,
          onWarning,
          onError,
        }: {
          tenantId: string;
          shopId: string;
          originalModules: IStoreDataNode[];
          prevModules: IModuleListItem[];
          newModules: IModuleListItem[];
          onSuccess: () => void;
          onWarning: (message: string) => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const changedModules = differenceWith(
          newModules,
          prevModules,
          (newModule, prevModule) => {
            return (
              newModule.moduleId === prevModule.moduleId &&
              newModule.isEnabled === prevModule.isEnabled
            );
          },
        );
        if (!changedModules.length) {
          onWarning(i18n.t("module.warning.noDataToChange"));
          return;
        }

        const moduleData = toModuleData(changedModules, originalModules);
        const { okResponses, error } =
          await moduleStatusUpdater.setModuleStatuses(
            tenantId,
            shopId,
            moduleData,
          );

        okResponses.forEach((response) => {
          thunkAPI.dispatch(
            addTask({
              title: i18n.t("module.tasks.updateModule", {
                name: response.moduleName,
              }),
              changeInfo: response.data,
            }),
          );
        });

        if (error) {
          onError(error);
          return;
        }

        onSuccess();
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

    copyConfiguration: create.asyncThunk(
      async (
        {
          tenantId,
          shopId,
          modules,
          onSuccess,
          onError,
        }: {
          tenantId: string;
          shopId: string;
          modules: IStoreDataNode[];
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const { data: tenantShops, error: loadShopsError } =
          await moduleListLoader.getTenantShops(tenantId);

        if (loadShopsError) {
          onError(loadShopsError);
          return;
        }

        const tenantShopsWithoutCurrentOne = tenantShops.filter(
          (shop) => shop.objectId !== shopId,
        );
        const moduleData = toSimpleModuleData(modules);

        for (const shop of tenantShopsWithoutCurrentOne) {
          if (!shop?.objectId) continue;

          const { okResponses, error: setStatusError } =
            await moduleStatusUpdater.setModuleStatuses(
              tenantId,
              shop.objectId,
              moduleData,
            );

          okResponses.forEach((response) => {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("module.tasks.copyConfiguration", {
                  moduleName: response.moduleName,
                  shopName: shop.displayName,
                }),
                changeInfo: response.data,
              }),
            );
          });

          if (setStatusError) {
            onError(setStatusError);
            return;
          }
        }

        onSuccess();
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
    selectModuleListData: (state) => state.moduleList,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
  },
});

export const { setModulesStatus, updateModules, copyConfiguration } =
  moduleFormSlice.actions;
export const { selectModuleListData, selectIsLoading, selectIsSubmitting } =
  moduleFormSlice.selectors;
