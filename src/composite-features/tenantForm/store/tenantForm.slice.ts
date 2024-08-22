import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import {
  getHistoryItemsFromIHATEOASItem,
  mapIHATEOASItemsToSelectOptions,
} from "@/common/services/HATEOASItems.mapper.ts";
import { ISelectOption } from "@/common/types";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { THistoryList } from "@/features/history";
import { addTask } from "@/features/tasks";

import { TTenantFormValues } from "../models/tenantForm.ts";
import {
  mapDataFromServer,
  mapDataToServer,
  toForceSynchronizationData,
} from "../service/tenantForm.mappers.ts";
import { tenantLoader } from "../service/tenantLoader.service.ts";

export interface ITenantFormSlice {
  isLoading: boolean;
  isSubmitting: boolean;
  formData: Partial<TTenantFormValues>;
  history: THistoryList;
  availableTemplates: string[];
  availableDatabaseVersions: string[];
  availableContainerSizes: string[];
  availableChains: ISelectOption[];
}

const initialState: ITenantFormSlice = {
  isLoading: false,
  isSubmitting: false,
  formData: {},
  history: [],
  availableTemplates: [],
  availableDatabaseVersions: [],
  availableContainerSizes: [],
  availableChains: [],
};

export const tenantFormSlice = createAppSlice({
  name: "tenantFormSlice",
  initialState,

  reducers: (create) => ({
    loadEditTenantData: create.asyncThunk(
      async ({
        routeObject,
        onError,
      }: {
        routeObject: IStoreDataNode;
        onError: (errorMessage: string) => void;
      }) => {
        const [
          { data: tenant, error: tenantError },
          { data: containerSizes, error: containerSizesError },
          { data: chains, error: chainsError },
        ] = await Promise.all([
          tenantLoader.getTenant(routeObject),
          tenantLoader.getAvailableContainerSizes(),
          tenantLoader.getAvailableChains(),
        ]);

        const error = tenantError || containerSizesError || chainsError;
        if (error) {
          onError(error);
          return null;
        }

        return { tenant, containerSizes, chains };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.formData = mapDataFromServer(payload.tenant || {});
          state.history = getHistoryItemsFromIHATEOASItem(payload.tenant || {});
          state.availableContainerSizes = payload.containerSizes || [];
          state.availableChains = mapIHATEOASItemsToSelectOptions(
            payload.chains,
          );
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    loadAddTenantData: create.asyncThunk(
      async ({ onError }: { onError: (errorMessage: string) => void }) => {
        const [
          { data: templates, error: templatesError },
          { data: databaseVersions, error: databaseVersionsError },
          { data: containerSizes, error: containerSizesError },
          { data: chains, error: chainsError },
        ] = await Promise.all([
          tenantLoader.getAvailableTemplates(),
          tenantLoader.getAvailableDatabaseVersions(),
          tenantLoader.getAvailableContainerSizes(),
          tenantLoader.getAvailableChains(),
        ]);

        const error =
          templatesError ||
          databaseVersionsError ||
          containerSizesError ||
          chainsError;
        if (error) {
          onError(error);
          return null;
        }

        return { templates, databaseVersions, containerSizes, chains };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.availableTemplates = payload.templates || [];
          state.availableDatabaseVersions = payload.databaseVersions || [];
          state.availableContainerSizes = payload.containerSizes || [];
          state.availableChains = mapIHATEOASItemsToSelectOptions(
            payload.chains,
          );
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    loadDuplicateTenantData: create.asyncThunk(
      async ({
        routeTenant,
        onError,
      }: {
        routeTenant: IStoreDataNode;
        onError: (errorMessage: string) => void;
      }) => {
        const [
          { data: tenant, error: tenantError },
          { data: templates, error: templatesError },
          { data: databaseVersions, error: databaseVersionsError },
          { data: containerSizes, error: containerSizesError },
          { data: chains, error: chainsError },
        ] = await Promise.all([
          tenantLoader.getTenant(routeTenant),
          tenantLoader.getAvailableTemplates(),
          tenantLoader.getAvailableDatabaseVersions(),
          tenantLoader.getAvailableContainerSizes(),
          tenantLoader.getAvailableChains(),
        ]);

        const error =
          tenantError ||
          templatesError ||
          databaseVersionsError ||
          containerSizesError ||
          chainsError;
        if (error) {
          onError(error);
          return null;
        }

        return { tenant, templates, databaseVersions, containerSizes, chains };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.formData = mapDataFromServer(payload.tenant || {});
          state.availableTemplates = payload.templates || [];
          state.availableDatabaseVersions = payload.databaseVersions || [];
          state.availableContainerSizes = payload.containerSizes || [];
          state.availableChains = mapIHATEOASItemsToSelectOptions(
            payload.chains,
          );
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    createTenant: create.asyncThunk(
      async (
        {
          values,
          routeServer,
          onSuccess,
          onError,
        }: {
          values: TTenantFormValues;
          routeServer: IStoreDataNode;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const tenantData = mapDataToServer({ values, routeServer });
        const { response, error } = await tenantLoader.createTenant(tenantData);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("tenant.tasks.addTenant", {
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

    updateTenant: create.asyncThunk(
      async (
        {
          routeObject,
          values,
          onSuccess,
          onError,
        }: {
          routeObject: IStoreDataNode;
          values: TTenantFormValues;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const tenantData = mapDataToServer({
          values,
          tenantId: routeObject.id,
        });
        const { response, error } = await tenantLoader.updateTenant(
          routeObject,
          tenantData,
        );

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("tenant.tasks.updateTenant", {
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

    forceSynchronization: create.asyncThunk(
      async (
        {
          tenantId,
          tenantName,
          onSuccess,
          onError,
        }: {
          tenantId: string;
          tenantName: string;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const data = toForceSynchronizationData(tenantId);
        const { response, error } =
          await tenantLoader.forceSynchronization(data);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("forceSynchronization.task", {
                  name: tenantName,
                  objectType: i18n.t("forceSynchronization.objectType.tenant"),
                }),
                changeInfo: response,
              }),
            );
          }
          onSuccess();
        }
      },
    ),
  }),

  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
    selectFormData: (state) => state.formData,
    selectTenantHistory: (state) => state.history,
    selectTemplates: (state) => state.availableTemplates,
    selectDatabaseVersions: (state) => state.availableDatabaseVersions,
    selectContainerSizes: (state) => state.availableContainerSizes,
    selectChains: (state) => state.availableChains,
  },
});

export const {
  loadEditTenantData,
  loadAddTenantData,
  loadDuplicateTenantData,
  createTenant,
  updateTenant,
  forceSynchronization,
} = tenantFormSlice.actions;

export const {
  selectIsLoading,
  selectIsSubmitting,
  selectFormData,
  selectTenantHistory,
  selectTemplates,
  selectDatabaseVersions,
  selectContainerSizes,
  selectChains,
} = tenantFormSlice.selectors;
