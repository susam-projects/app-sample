import { createAppSlice } from "@/app/store";
import { objectsPageApi } from "@/pages/ObjectsPage/api/objectsPage.api.ts";

export interface IObjectsPageSlice {
  tags: string[];
}

const initialState: IObjectsPageSlice = {
  tags: ["TAG_1", "TAG_11", "TAG_2", "TAG_3"],
};

export const objectsPageSlice = createAppSlice({
  name: "objectsPage",
  initialState,

  reducers: (create) => ({
    loadTags: create.asyncThunk(
      async (payload: { onError: (error: unknown) => void }) => {
        try {
          const response = await objectsPageApi.getAll();
          return { tags: response.data || [] };
        } catch (e) {
          console.error(e);
          payload.onError(e);
          return { tags: [] };
        }
      },
      {
        fulfilled: (state, { payload: { tags } }) => {
          // state.tags = tags;
          // TODO: remove it, get real data
          console.log(tags); // just to shut the eslint up
          state.tags = ["TAG_1", "TAG_11", "TAG_2", "TAG_3"];
        },
      },
    ),
  }),

  selectors: {
    selectTags: (state) =>
      state.tags.map((tag) => ({ label: tag, value: tag })),
  },
});

export const { loadTags } = objectsPageSlice.actions;

export const { selectTags } = objectsPageSlice.selectors;
