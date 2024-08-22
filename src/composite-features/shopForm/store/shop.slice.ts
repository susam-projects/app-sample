import noop from "lodash/noop";

import { createAppSlice } from "@/app/store";
import { IHATEOASItem } from "@/common/api";
import i18n from "@/common/i18n";
import {
  getHistoryItemsFromIHATEOASItem,
  mapIHATEOASItemsToSelectOptions,
} from "@/common/services";
import { ISelectOption } from "@/common/types";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { entityUserInfo } from "@/feature-blocks/userInfo";
import { THistoryList } from "@/features/history";
import { addTask } from "@/features/tasks";

import { TCreateShopFormValues, TEditShopFormValues } from "../models/shop";
import { ShopMappers } from "../services/shop.mappers";
import { shopDataLoader } from "../services/shopLoader.service";

export interface IShopSlice {
  pumpGroup: Array<ISelectOption>;
  chain: Array<ISelectOption>;
  storeSign: Array<ISelectOption>;
  tags: Array<ISelectOption>;
  shopData: Partial<TEditShopFormValues>;
  history: THistoryList;
  isLoading: boolean;
  isSubmitting: boolean;
}

const initialState: IShopSlice = {
  pumpGroup: [],
  chain: [],
  storeSign: [],
  tags: [],
  shopData: {},
  history: [],
  isLoading: false,
  isSubmitting: false,
};

export const shopSlice = createAppSlice({
  name: "shop",
  initialState,

  reducers: (create) => ({
    loadEditShopData: create.asyncThunk(
      async ({
        routeObject,
        tenant,
        onError = noop,
      }: {
        routeObject: IStoreDataNode;
        tenant: IStoreDataNode;
        onError?: (errorMessage: string) => void;
      }) => {
        const [
          { data: shop, error: shopError },
          { data: chainList, error: chainListError },
          { data: logicalStockGroupList, error: logicalStockGroupListError },
          { data: tenantData, error: tenantError },
        ] = await Promise.all([
          shopDataLoader.getShop(routeObject),
          shopDataLoader.getChainList(tenant.id),
          shopDataLoader.getLogicalStockGroupList(tenant.id),
          shopDataLoader.getTenant(tenant),
        ]);

        const error =
          shopError ||
          chainListError ||
          logicalStockGroupListError ||
          tenantError;
        if (error) {
          onError(error);
          return null;
        }

        return { shop, chainList, logicalStockGroupList, tenantData };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.shopData = ShopMappers.mapDataFromServer(
            payload.shop || {},
            payload.tenantData || {},
          );
          state.history = getHistoryItemsFromIHATEOASItem(payload.shop || {});
          state.chain = mapIHATEOASItemsToSelectOptions(payload.chainList);
          state.pumpGroup = mapIHATEOASItemsToSelectOptions(
            payload.logicalStockGroupList,
          );
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    loadAddShopData: create.asyncThunk(
      async ({
        tenantId,
        onError = noop,
      }: {
        tenantId: string;
        onError?: (errorMessage: string) => void;
      }) => {
        const [
          { data: chainList, error: chainListError },
          { data: logicalStockGroupList, error: logicalStockGroupListError },
          { data: brandList, error: brandListError },
        ] = await Promise.all([
          shopDataLoader.getChainList(tenantId),
          shopDataLoader.getLogicalStockGroupList(tenantId),
          shopDataLoader.getBrandList(tenantId),
        ]);

        const error =
          chainListError || logicalStockGroupListError || brandListError;
        if (error) {
          onError(error);
          return null;
        }

        return { chainList, logicalStockGroupList, brandList };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.chain = mapIHATEOASItemsToSelectOptions(payload.chainList);
          state.pumpGroup = mapIHATEOASItemsToSelectOptions(
            payload.logicalStockGroupList,
          );
          state.storeSign = mapIHATEOASItemsToSelectOptions(payload.brandList);
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    loadDuplicateShopData: create.asyncThunk(
      async ({
        routeObject,
        tenant,
        onError = noop,
      }: {
        routeObject: IStoreDataNode;
        tenant: IStoreDataNode;
        onError?: (errorMessage: string) => void;
      }) => {
        const [
          { data: shop, error: shopError },
          { data: chainList, error: chainListError },
          { data: logicalStockGroupList, error: logicalStockGroupListError },
          { data: brandList, error: brandListError },
          { data: tenantData, error: tenantError },
        ] = await Promise.all([
          shopDataLoader.getShop(routeObject),
          shopDataLoader.getChainList(tenant.id),
          shopDataLoader.getLogicalStockGroupList(tenant.id),
          shopDataLoader.getBrandList(tenant.id),
          shopDataLoader.getTenant(tenant),
        ]);

        const error =
          shopError ||
          chainListError ||
          logicalStockGroupListError ||
          brandListError ||
          tenantError;
        if (error) {
          onError(error);
          return null;
        }

        return {
          shop,
          chainList,
          logicalStockGroupList,
          brandList,
          tenantData,
        };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.shopData = ShopMappers.mapDataFromServer(
            payload.shop || {},
            payload.tenantData || {},
          );
          state.chain = mapIHATEOASItemsToSelectOptions(payload.chainList);
          state.pumpGroup = mapIHATEOASItemsToSelectOptions(
            payload.logicalStockGroupList,
          );
          state.storeSign = mapIHATEOASItemsToSelectOptions(payload.brandList);
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    createLogicalStockGroup: create.asyncThunk(
      async (
        {
          displayName,
          tenantId,
          onError = noop,
          onSuccess = noop,
        }: {
          displayName: string;
          tenantId: string;
          onError?: (errorMessage: string) => void;
          onSuccess?: () => void;
        },
        thunkAPI,
      ) => {
        const { response, error } =
          await shopDataLoader.createLogicalStockGroup({
            ...entityUserInfo.getUserData(),
            displayName,
            idTenant: tenantId,
          });
        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("logicalStockGroup.tasks.addLogicalStockGroup", {
                  name: displayName,
                }),
                changeInfo: response,
              }),
            );
          }
          onSuccess();
        }
      },
    ),

    loadLogicalStockGroup: create.asyncThunk(
      async ({
        tenantId,
        onError = noop,
        onSuccess = noop,
      }: {
        tenantId: string;
        onError?: (errorMessage: string) => void;
        onSuccess?: (logicalStockGroupList: IHATEOASItem[] | undefined) => void;
      }) => {
        const {
          data: logicalStockGroupList,
          error: logicalStockGroupListError,
        } = await shopDataLoader.getLogicalStockGroupList(tenantId);

        if (logicalStockGroupListError) {
          onError(logicalStockGroupListError);
          return null;
        } else {
          onSuccess(logicalStockGroupList);
        }

        return { logicalStockGroupList };
      },
      {
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.pumpGroup = mapIHATEOASItemsToSelectOptions(
            payload.logicalStockGroupList,
          );
        },
      },
    ),

    createShop: create.asyncThunk(
      async (
        {
          values,
          tenantId,
          onSuccess,
          onError,
        }: {
          values: TCreateShopFormValues;
          tenantId: string;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const shopData = ShopMappers.mapAddShopDataToServer(values, tenantId);
        const { response, error } = await shopDataLoader.createShop(shopData);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("shop.tasks.addShop", {
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

    updateShop: create.asyncThunk(
      async (
        {
          routeObject,
          values,
          tenantId,
          onSuccess,
          onError,
        }: {
          routeObject: IStoreDataNode;
          values: TEditShopFormValues;
          tenantId: string;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const shopData = ShopMappers.mapEditShopDataToServer(
          values,
          routeObject.id,
          tenantId,
        );
        const { response, error } = await shopDataLoader.updateShop(
          routeObject,
          shopData,
        );

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("shop.tasks.updateShop", {
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
          shopId,
          shopName,
          onSuccess,
          onError,
        }: {
          tenantId: string;
          shopId: string;
          shopName: string;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const data = ShopMappers.toForceSynchronizationData(tenantId, shopId);
        const { response, error } =
          await shopDataLoader.forceSynchronization(data);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("forceSynchronization.task", {
                  name: shopName,
                  objectType: i18n.t("forceSynchronization.objectType.shop"),
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
    selectPumpGroup: (state) => state.pumpGroup,
    selectChain: (state) => state.chain,
    selectStoreSign: (state) => state.storeSign,
    selectTag: (state) => state.tags,
    selectShopData: (state) => state.shopData,
    selectShopHistory: (state) => state.history,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
  },
});

export const {
  createLogicalStockGroup,
  loadLogicalStockGroup,
  loadEditShopData,
  loadAddShopData,
  loadDuplicateShopData,
  createShop,
  updateShop,
  forceSynchronization,
} = shopSlice.actions;
export const {
  selectPumpGroup,
  selectChain,
  selectStoreSign,
  selectTag,
  selectShopData,
  selectShopHistory,
  selectIsLoading,
  selectIsSubmitting,
} = shopSlice.selectors;
