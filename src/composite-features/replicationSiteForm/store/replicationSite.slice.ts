import noop from "lodash/noop";

import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import { mapIHATEOASItemsToSelectOptions } from "@/common/services";
import { ISelectOption } from "@/common/types";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { addTask } from "@/features/tasks";

import {
  TAddReplicationSiteFormValues,
  TEditReplicationSiteFormValues,
} from "../models/replicationSite";
import { ReplicationSiteMappers } from "../service/replicationSite.mappers";
import { replicationSiteDataLoader } from "../service/replicationSiteLoader.service";

export interface IReplicationSiteSlice {
  shopList: Array<ISelectOption>;
  replicationSiteData: Partial<TEditReplicationSiteFormValues>;
  isLoading: boolean;
  isSubmitting: boolean;
  chainId: string | null;
}

const initialState: IReplicationSiteSlice = {
  shopList: [],
  replicationSiteData: {},
  isLoading: false,
  isSubmitting: false,
  chainId: null,
};

export const replicationSiteSlice = createAppSlice({
  name: "replicationSite",
  initialState,

  reducers: (create) => ({
    loadEditDuplicateReplicationSiteData: create.asyncThunk(
      async ({
        routeReplicationSite,
        routeTenant,
        onError = noop,
      }: {
        routeReplicationSite: IStoreDataNode;
        routeTenant: IStoreDataNode;
        onError?: (errorMessage: string) => void;
      }) => {
        const [
          { data: replicationSite, error: replicationSiteError },
          { data: tenantData, error: tenantError },
          { data: shopData, error: shopError },
        ] = await Promise.all([
          replicationSiteDataLoader.getReplicationSite(routeReplicationSite),
          replicationSiteDataLoader.getTenant(routeTenant),
          replicationSiteDataLoader.getShopList(routeTenant.id),
        ]);

        const error = replicationSiteError || tenantError || shopError;
        if (error) {
          onError(error);
          return null;
        }

        return { replicationSite, tenantData, shopData };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.replicationSiteData = ReplicationSiteMappers.mapDataFromServer(
            payload.replicationSite || {},
          );
          state.shopList = mapIHATEOASItemsToSelectOptions(payload.shopData);
          state.chainId = payload.tenantData?.idChain || null;
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    loadAddReplicationSiteData: create.asyncThunk(
      async ({
        tenant,
        onError = noop,
      }: {
        tenant: IStoreDataNode;
        onError?: (errorMessage: string) => void;
      }) => {
        const [
          { data: tenantData, error: tenantError },
          { data: shopData, error: shopError },
        ] = await Promise.all([
          replicationSiteDataLoader.getTenant(tenant),
          replicationSiteDataLoader.getShopList(tenant.id),
        ]);

        const error = tenantError || shopError;
        if (error) {
          onError(error);
          return null;
        }

        return { tenantData, shopData };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.chainId = payload.tenantData?.idChain || null;
          state.shopList = mapIHATEOASItemsToSelectOptions(payload.shopData);
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    createReplicationSite: create.asyncThunk(
      async (
        {
          values,
          tenantId,
          chainId,
          onSuccess,
          onError,
        }: {
          values: TAddReplicationSiteFormValues;
          tenantId: string;
          chainId: string | null;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const replicationSiteData =
          ReplicationSiteMappers.mapReplicationSiteDataToServer(
            values,
            tenantId,
            chainId,
          );
        const { response, error } =
          await replicationSiteDataLoader.createReplicationSite(
            replicationSiteData,
          );

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("replicationSite.tasks.addReplicationSite", {
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

    updateReplicationSite: create.asyncThunk(
      async (
        {
          routeReplicationSite,
          values,
          tenantId,
          chainId,
          onSuccess,
          onError,
        }: {
          routeReplicationSite: IStoreDataNode;
          values: TEditReplicationSiteFormValues;
          tenantId: string;
          chainId: string | null;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const replicationSiteData =
          ReplicationSiteMappers.mapReplicationSiteDataToServer(
            values,
            tenantId,
            chainId,
            routeReplicationSite.id,
          );
        const { response, error } =
          await replicationSiteDataLoader.updateReplicationSite(
            routeReplicationSite,
            replicationSiteData,
          );

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("replicationSite.tasks.updateReplicationSite", {
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

    clearChildrenShopsData: create.reducer((state) => {
      state.shopList = [];
    }),

    forceSynchronization: create.asyncThunk(
      async (
        {
          tenantId,
          replicationSiteId,
          replicationSiteName,
          onSuccess,
          onError,
        }: {
          tenantId: string;
          replicationSiteId: string;
          replicationSiteName: string;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const data = ReplicationSiteMappers.toForceSynchronizationData(
          tenantId,
          replicationSiteId,
        );
        const { response, error } =
          await replicationSiteDataLoader.forceSynchronization(data);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("forceSynchronization.task", {
                  name: replicationSiteName,
                  objectType: i18n.t(
                    "forceSynchronization.objectType.replicationSite",
                  ),
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
    selectShopList: (state) => state.shopList,
    selectReplicationSiteData: (state) => state.replicationSiteData,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
    selectChainId: (state) => state.chainId,
  },
});

export const {
  loadEditDuplicateReplicationSiteData,
  loadAddReplicationSiteData,
  createReplicationSite,
  updateReplicationSite,
  clearChildrenShopsData,
  forceSynchronization,
} = replicationSiteSlice.actions;
export const {
  selectShopList,
  selectReplicationSiteData,
  selectIsLoading,
  selectIsSubmitting,
  selectChainId,
} = replicationSiteSlice.selectors;
