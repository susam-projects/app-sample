import { RootState, createAppSlice } from "@/app/store";

import { THistoryList } from "../models/history";

const historyDataList: THistoryList = [
  {
    key: "1",
    date: "01/01/2023 - 10:28",
    user: "LGE",
    actionType: "Create",
    detail: "Chullanka Antibes 1",
    result: "OK",
    info: "-",
    duration: "12 sec",
  },
  {
    key: "2",
    date: "12/02/2022 - 12:34",
    user: "LGE",
    actionType: "Activation",
    detail: "Chullanka Antibes 2",
    result: "OK",
    info: "-",
    duration: "1 sec",
  },
  {
    key: "3",
    date: "22/03/2022 - 11:30",
    user: "LGE",
    actionType: "Activation",
    detail: "Chullanka Antibes 3",
    result: "OK",
    info: "-",
    duration: "11 sec",
  },
  {
    key: "4",
    date: "23/03/2022 - 13:23",
    user: "LGE",
    actionType: "Activation",
    detail: "Chullanka Antibes 4",
    result: "OK",
    info: "-",
    duration: "13 sec",
  },
  {
    key: "5",
    date: "24/03/2022 - 17:56",
    user: "LGE",
    actionType: "Create",
    detail: "Chullanka Antibes 5",
    result: "OK",
    info: "-",
    duration: "14 sec",
  },
  {
    key: "6",
    date: "30/03/2022 - 14:14",
    user: "LGE",
    actionType: "Activation",
    detail: "Chullanka Antibes 6",
    result: "OK",
    info: "-",
    duration: "3 sec",
  },
  {
    key: "7",
    date: "02/04/2022 - 19:43",
    user: "LGE",
    actionType: "Create",
    detail: "Chullanka Antibes 7",
    result: "OK",
    info: "-",
    duration: "9 sec",
  },
  {
    key: "8",
    date: "09/04/2022 - 18:21",
    user: "LGE",
    actionType: "Activation",
    detail: "Chullanka Antibes 8",
    result: "OK",
    info: "-",
    duration: "15 sec",
  },
  {
    key: "9",
    date: "10/04/2022 - 11:39",
    user: "LGE",
    actionType: "Create",
    detail: "Chullanka Antibes 9",
    result: "OK",
    info: "-",
    duration: "19 sec",
  },
  {
    key: "10",
    date: "11/04/2022 - 12:50",
    user: "LGE",
    actionType: "Activation",
    detail: "Chullanka Antibes 10",
    result: "OK",
    info: "-",
    duration: "13 sec",
  },
  {
    key: "11",
    date: "12/04/2022 - 13:51",
    user: "LGE",
    actionType: "Create",
    detail: "Chullanka Antibes 11",
    result: "OK",
    info: "-",
    duration: "4 sec",
  },
  {
    key: "12",
    date: "15/04/2022 - 11:31",
    user: "LGE",
    actionType: "Create",
    detail: "Chullanka Antibes 12",
    result: "OK",
    info: "-",
    duration: "20 sec",
  },
];

const INITIAL_NUMBER_OF_TABLE_ROWS = 3;

export interface ImoduleSlice {
  historyList: THistoryList;
  isLoading: boolean;
  isLoadingMoreData: boolean;
  firstDataList: THistoryList | undefined;
}

const initialState: ImoduleSlice = {
  historyList: [],
  isLoading: false,
  isLoadingMoreData: false,
  firstDataList: undefined,
};

const getHistoryListData = (): Promise<THistoryList> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(historyDataList);
    }, 1000);
  });
};

export const historySlice = createAppSlice({
  name: "historySlice",
  initialState,

  reducers: (create) => ({
    loadHistoryListData: create.asyncThunk(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (_: void) => {
        try {
          const moduleListData = await getHistoryListData();
          return moduleListData;
        } catch (err) {
          console.error("load data error", err);
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
        },
        fulfilled: (state, { payload }) => {
          state.historyList =
            payload?.slice(0, INITIAL_NUMBER_OF_TABLE_ROWS) || [];
          if (payload && payload.length > INITIAL_NUMBER_OF_TABLE_ROWS) {
            state.firstDataList = payload;
          }
          state.isLoading = false;
        },
        rejected: (state) => {
          state.isLoading = false;
        },
      },
    ),
    loadMoreHistoryListData: create.asyncThunk(
      async (_: void, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        try {
          if (state.historySlice.firstDataList) {
            return [];
          } else {
            const moduleListData = await getHistoryListData();
            return moduleListData;
          }
        } catch (err) {
          console.error("load data error", err);
        }
      },
      {
        pending: (state) => {
          state.isLoadingMoreData = true;
        },
        fulfilled: (state, { payload }) => {
          if (state.firstDataList) {
            state.historyList = state.firstDataList;
            state.firstDataList = undefined;
          } else {
            state.historyList = [...state.historyList, ...(payload || [])];
          }
          state.isLoadingMoreData = false;
        },
        rejected: (state) => {
          state.isLoadingMoreData = false;
        },
      },
    ),
  }),

  selectors: {
    selectHistoryListData: (state) => state.historyList,
    selectIsLoading: (state) => state.isLoading,
    selectIsLoadingMoreData: (state) => state.isLoadingMoreData,
  },
});

export const { loadHistoryListData, loadMoreHistoryListData } =
  historySlice.actions;
export const {
  selectHistoryListData,
  selectIsLoading,
  selectIsLoadingMoreData,
} = historySlice.selectors;
