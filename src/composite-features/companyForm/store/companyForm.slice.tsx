import { createAppSlice } from "@/app/store";
import i18n from "@/common/i18n";
import { getHistoryItemsFromIHATEOASItem } from "@/common/services";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { THistoryList } from "@/features/history";
import { addTask } from "@/features/tasks";

import { TCompanyFormValues } from "../models/companyForm.ts";
import { companyDataLoader } from "../service/companyDataLoader.service.ts";
import {
  mapDataFromServer,
  mapFormValuesToServer,
} from "../service/companyForm.mapper.ts";

export interface ICompanyFormSlice {
  company: TCompanyFormValues;
  history: THistoryList;
  isLoading: boolean;
  isSubmitting: boolean;
}

const initialState: ICompanyFormSlice = {
  company: {
    companyName: "",
    finYearEndDate: "",
  },
  history: [],
  isLoading: false,
  isSubmitting: false,
};

export const companyFormSlice = createAppSlice({
  name: "companyForm",
  initialState,

  reducers: (create) => ({
    loadCompany: create.asyncThunk(
      async ({
        routeObject,
        onError,
      }: {
        routeObject: IStoreDataNode;
        onError: (errorMessage: string) => void;
      }) => {
        const { data, error } = await companyDataLoader.getCompany(routeObject);
        if (error) {
          onError(error);
          return {};
        }
        return { data };
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload: { data } }) => {
          state.company = mapDataFromServer(data || {});
          state.history = getHistoryItemsFromIHATEOASItem(data || {});
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),

    createCompany: create.asyncThunk(
      async (
        {
          tenantId,
          values,
          onSuccess,
          onError,
        }: {
          tenantId: string;
          values: TCompanyFormValues;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const companyData = mapFormValuesToServer(values, tenantId);
        const { response, error } =
          await companyDataLoader.createCompany(companyData);

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("company.tasks.addCompany", {
                  name: values.companyName,
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

    updateCompany: create.asyncThunk(
      async (
        {
          tenantId,
          companyId,
          routeObject,
          values,
          onSuccess,
          onError,
        }: {
          tenantId: string;
          companyId: string;
          routeObject: IStoreDataNode;
          values: TCompanyFormValues;
          onSuccess: () => void;
          onError: (errorMessage: string) => void;
        },
        thunkAPI,
      ) => {
        const companyData = mapFormValuesToServer(values, tenantId, companyId);
        const { response, error } = await companyDataLoader.updateCompany(
          routeObject,
          companyData,
        );

        if (error) {
          onError(error);
        } else {
          if (response) {
            thunkAPI.dispatch(
              addTask({
                title: i18n.t("company.tasks.updateCompany", {
                  name: values.companyName,
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
    selectCompany: (state) => state.company,
    selectHistory: (state) => state.history,
    selectIsLoading: (state) => state.isLoading,
    selectIsSubmitting: (state) => state.isSubmitting,
  },
});

export const { loadCompany, createCompany, updateCompany } =
  companyFormSlice.actions;

export const {
  selectCompany,
  selectHistory,
  selectIsSubmitting,
  selectIsLoading,
} = companyFormSlice.selectors;
