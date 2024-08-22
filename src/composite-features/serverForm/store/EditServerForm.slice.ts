import { createAppSlice } from "@/app/store";
import { TEditServerFormValues } from "@/composite-features/serverForm/models/serverForm.model.ts";
import { IStoreDataNode } from "@/feature-blocks/objectTree";
import { serverLoader } from "@/features/server";

import { mapDataFromServer } from "../services/serverForm.mapper.ts";

export interface IEditServerFormSlice {
  isLoading: boolean;
  formData: Partial<TEditServerFormValues>;
}

const initialState: IEditServerFormSlice = {
  isLoading: false,
  formData: {},
};

export const editServerFormSlice = createAppSlice({
  name: "editServerForm",
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
        const { data, error } = await serverLoader.getServer(routeObject);
        if (error) {
          onError(error);
          return null;
        }
        return data;
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          if (!payload) return;
          state.formData = mapDataFromServer(payload);
        },
        settled: (state) => {
          state.isLoading = false;
        },
      },
    ),
  }),

  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectFormData: (state) => state.formData,
  },
});

export const { loadData } = editServerFormSlice.actions;
export const { selectIsLoading, selectFormData } =
  editServerFormSlice.selectors;
