import type {
  Action,
  ActionCreator,
  ThunkAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";

import { companyFormSlice } from "@/composite-features/companyForm";
import {
  createDeviceSlice,
  duplicatedDeviceSlice,
  editDeviceSlice,
} from "@/composite-features/deviceForm";
import { moduleFormSlice } from "@/composite-features/moduleForm";
import { replicationSiteSlice } from "@/composite-features/replicationSiteForm";
import { editServerFormSlice } from "@/composite-features/serverForm";
import { shopSlice } from "@/composite-features/shopForm";
import { tenantFormSlice } from "@/composite-features/tenantForm";
import { objectTreeSlice } from "@/feature-blocks/objectTree";
import { historySlice } from "@/features/history";
import { clearTasksSlice, tasksSlice } from "@/features/tasks";
import { objectsPageSlice } from "@/pages";

const rootReducer = combineSlices(
  objectsPageSlice,
  objectTreeSlice,
  editServerFormSlice,
  tenantFormSlice,
  shopSlice,
  replicationSiteSlice,
  createDeviceSlice,
  duplicatedDeviceSlice,
  editDeviceSlice,
  moduleFormSlice,
  companyFormSlice,
  historySlice,
  tasksSlice,
);
export type RootState = ReturnType<typeof rootReducer>;

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export const store = makeStore();

// Add here everything that needs to be cleared on logout
export const clearActions: ActionCreator<UnknownAction>[] = [clearTasksSlice];

export const clearStore = () => {
  clearActions.forEach((action) => {
    store.dispatch(action());
  });
};

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
