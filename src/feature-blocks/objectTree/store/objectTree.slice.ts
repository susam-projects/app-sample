import { createSelector } from "@reduxjs/toolkit";
import difference from "lodash/difference";
import isEqual from "lodash/isEqual";
import noop from "lodash/noop";
import without from "lodash/without";

import { createAppSlice, RootState } from "@/app/store";
import { skipNullable } from "@/common/utils/mapUtils.ts";

import { ROOT_OBJECT } from "../constants/objectTree.constants.ts";
import {
  ERROR_LOADING_SERVERS_LIST,
  ERROR_NO_CHILDREN,
} from "../constants/objectTree.errors.ts";
import { getContextMenuItems } from "../containers/ObjectTree/useContextMenuActions.tsx";
import { Objects } from "../mappers/objectTree.mappers.tsx";
import { treeDataLoader } from "../service/objectsLoader.service.ts";
import { treeService } from "../service/tree.service.ts";
import { uiTreeService } from "../service/uiTree.service.ts";
import { TEST_DATA, TEST_LOADED_KEYS } from "../store/testData.ts";
import {
  IStoreDataNode,
  IUiDataNode,
  ObjectType,
  TObjectId,
  TObjectTreeData,
  TUiNodeType,
  UiObjectType,
} from "../types/objectTreeTypes.ts";

export interface IObjectTreeSlice {
  route: string;
  routeKeys: string[];
  routeObjectKeys: string[];

  objects: TObjectTreeData;

  selectedKeys: string[];
  loadedKeys: string[];
  expandedKeys: string[];

  movingObjects: IStoreDataNode[];
  movingTarget: IStoreDataNode | null;

  contextMenuObjectKeys: string[];
  contextMenuPosition: { x: number; y: number } | null;

  isLoading: boolean;
}

const initialState: IObjectTreeSlice = {
  route: "",
  routeKeys: [],
  routeObjectKeys: [],
  objects: {
    root: { [ROOT_OBJECT.id]: { ...ROOT_OBJECT } },
  },
  selectedKeys: [],
  loadedKeys: [],
  expandedKeys: [],
  movingObjects: [],
  movingTarget: null,
  contextMenuObjectKeys: [],
  contextMenuPosition: null,
  isLoading: false,
};

export const selectContextMenuNodes_ = createSelector(
  [
    (state: IObjectTreeSlice) => state.objects,
    (state: IObjectTreeSlice) => state.contextMenuObjectKeys,
  ],
  (objects, keys) => {
    if (!keys.length) {
      return [];
    }

    const uiObjects = Objects.storeDataToFullUiData(objects);
    return keys
      .map((key) => uiObjects && uiTreeService.getUiItemByKey(uiObjects, key))
      .filter(skipNullable) as IUiDataNode[];
  },
);

export const objectTreeSlice = createAppSlice({
  name: "objectTree",
  initialState,

  reducers: (create) => {
    const navigate = (
      state: IObjectTreeSlice,
      route: string,
      objectKeys: string[],
    ) => {
      state.routeKeys = objectKeys;
      state.route = route;
    };

    return {
      // TODO: remove it
      setTestData: create.reducer((state) => {
        state.objects = TEST_DATA;
        state.loadedKeys = TEST_LOADED_KEYS;
        state.selectedKeys = [];
      }),

      navigate: create.reducer<{
        route: string;
        objectKeys?: string[];
      }>((state, { payload: { route, objectKeys = [] } }) => {
        navigate(state, route, objectKeys);
      }),

      loadRouteObjects: create.reducer<{ objectKeys: string[] }>(
        (state, { payload: { objectKeys } }) => {
          state.routeObjectKeys = objectKeys;
        },
      ),

      loadInitialData: create.asyncThunk(
        async (payload: { onError: (error: unknown) => void }) => {
          const { data: servers, error } = await treeDataLoader.getServerList();
          if (error) {
            payload.onError(ERROR_LOADING_SERVERS_LIST);
          }
          return { servers: servers || [] };
        },
        {
          pending: (state) => {
            state.isLoading = true;
          },
          fulfilled: (state, { payload: { servers } }) => {
            const serverObjects = Objects.serverDataToStoreData(servers);

            state.objects = treeService.setChildren(
              state.objects,
              ROOT_OBJECT.type,
              ROOT_OBJECT.id,
              serverObjects,
            );
          },
          settled: (state) => {
            state.isLoading = false;
          },
        },
      ),

      filterTree: create.asyncThunk(
        async (payload: {
          searchValue: string;
          tag: string | null;
          onError: (error: unknown) => void;
        }) => {
          const { data, error } = await treeDataLoader.searchObjects(
            payload.searchValue,
            payload.tag,
          );

          if (error) {
            payload.onError(error);
          }
          return { data: data || [] };
        },
        {
          pending: (state) => {
            state.isLoading = true;
          },
          fulfilled: (state, { payload: { data } }) => {
            console.log(state, data);
            // state.objects = data;
          },
          settled: (state) => {
            state.isLoading = false;
          },
        },
      ),

      loadNodeChildren: create.asyncThunk(
        async (
          {
            parentKey,
            parentId,
            parentType,
            onError = noop,
            onFinish = noop,
          }: {
            parentKey: string;
            parentId: TObjectId;
            parentType: TUiNodeType;
            onError?: (error: unknown) => void;
            onFinish?: () => void;
          },
          thunkAPI,
        ) => {
          const state = thunkAPI.getState() as RootState;
          const objects = state.objectTree.objects;
          const storedParent = treeService.getItemByKey(objects, parentKey);
          const parentLinks = storedParent?.selfLinks || [];

          // haven't found a way for the groups to be marked as loaded by default,
          // so just skipping the attempt to load data here
          if (parentType === UiObjectType.Group) {
            onFinish();
            return { parentKey, parentId, parentType, children: [] };
          }

          const { data: children, error } =
            await treeDataLoader.getChildrenByParentLinks(parentLinks);
          if (error) {
            onError(error);
          } else if (!children?.length) {
            onError(ERROR_NO_CHILDREN);
          }

          onFinish();
          return { parentKey, parentId, parentType, children };
        },
        {
          pending: (state) => {
            state.isLoading = true;
          },

          fulfilled: (
            state,
            { payload: { parentKey, parentId, parentType, children } },
          ) => {
            if (!parentKey || !parentId || !parentType) {
              return;
            }

            if (parentType === UiObjectType.Group) {
              // no need to load a group, the data should already be there
              const uniqueKeys = new Set([...state.loadedKeys, parentKey]);
              const newKeys = [...uniqueKeys];
              if (!isEqual(newKeys, state.loadedKeys)) {
                state.loadedKeys = newKeys;
              }
              return;
            }

            // collapse descendants
            const uiObjects = Objects.storeDataToFullUiData(state.objects);
            const descendantKeys = uiObjects
              ? uiTreeService.getDescendantKeys(uiObjects, parentKey)
              : [];
            state.loadedKeys = difference(state.loadedKeys, descendantKeys);
            state.expandedKeys = difference(state.expandedKeys, descendantKeys);
            state.selectedKeys = difference(state.selectedKeys, descendantKeys);

            const mappedChildren = Objects.serverChildrenToStoreData(
              children || [],
            );
            if (!mappedChildren?.length) {
              state.expandedKeys = without(state.expandedKeys, parentKey);
              return;
            }

            // set new objects
            state.objects = treeService.setChildren(
              state.objects,
              parentType,
              parentId,
              mappedChildren,
            );

            // mark parent as loaded
            const uniqueKeys = new Set([...state.loadedKeys, parentKey]);
            const newKeys = [...uniqueKeys];
            if (!isEqual(newKeys, state.loadedKeys)) {
              state.loadedKeys = newKeys;
            }

            // trigger reload of the form
            state.routeObjectKeys = [...state.routeObjectKeys];
          },

          settled: (state) => {
            state.isLoading = false;
          },
        },
      ),

      enableNode: create.asyncThunk(
        async (
          {
            key,
            onSuccess = noop,
            onError = noop,
          }: {
            key: string;
            onSuccess: () => void;
            onError: (errorType: string) => void;
          },
          thunkAPI,
        ) => {
          const state = thunkAPI.getState() as RootState;
          const objects = state.objectTree.objects;
          const storedNode = treeService.getItemByKey(objects, key);
          const nodeLinks = storedNode?.selfLinks || [];

          const { data: node, error: getError } =
            await treeDataLoader.getObjectByLinks(nodeLinks);
          if (getError) {
            onError(getError);
            return;
          }

          const { data: updateResponse, error: updateError } =
            await treeDataLoader.updateObject(nodeLinks, {
              ...node,
              enabled: true,
            });
          if (updateError) {
            onError(updateError);
            return;
          }

          onSuccess();
          console.log(updateResponse);
        },
      ),

      disableNode: create.asyncThunk(
        async (
          {
            key,
            onSuccess = noop,
            onError = noop,
          }: {
            key: string;
            onSuccess: () => void;
            onError: (errorType: string) => void;
          },
          thunkAPI,
        ) => {
          const state = thunkAPI.getState() as RootState;
          const objects = state.objectTree.objects;
          const storedNode = treeService.getItemByKey(objects, key);
          const nodeLinks = storedNode?.selfLinks || [];

          const { data: node, error: getError } =
            await treeDataLoader.getObjectByLinks(nodeLinks);
          if (getError) {
            onError(getError);
            return;
          }

          const { data: updateResponse, error: updateError } =
            await treeDataLoader.updateObject(nodeLinks, {
              ...node,
              enabled: false,
            });
          if (updateError) {
            onError(updateError);
            return;
          }

          onSuccess();
          console.log(updateResponse);
        },
      ),

      setMovingObjects: create.reducer<{ keys: string[] }>(
        (state, { payload: { keys } }) => {
          state.movingObjects = keys
            .map((key) => treeService.getItemByKey(state.objects, key)!)
            .filter(skipNullable);
        },
      ),

      setMovingTarget: create.reducer<{ key: string | null }>(
        (state, { payload: { key } }) => {
          state.movingTarget =
            (key && treeService.getItemByKey(state.objects, key)) || null;
        },
      ),

      setContextMenuObjects: create.reducer<{ keys: string[] }>(
        (state, { payload: { keys } }) => {
          state.contextMenuObjectKeys = keys;
        },
      ),

      openContextMenu: create.reducer<{ x: number; y: number }>(
        (state, { payload }) => {
          state.contextMenuPosition = payload;
        },
      ),

      closeContextMenu: create.reducer((state) => {
        state.contextMenuPosition = null;
      }),

      clearContextMenuObjects: create.reducer((state) => {
        state.contextMenuObjectKeys = [];
      }),

      expandNode: create.reducer<{ nodeKey: string }>(
        (state, { payload: { nodeKey } }) => {
          const uniqueKeys = new Set([...state.expandedKeys, nodeKey]);
          state.expandedKeys = [...uniqueKeys];
        },
      ),

      collapseNode: create.reducer<{ keys: string[] }>(
        (state, { payload: { keys } }) => {
          state.expandedKeys = [...keys];
        },
      ),

      selectNode: create.reducer<{
        isCtrlPressed: boolean;
        nodeKey: string;
        nodeType: TUiNodeType;
      }>((state, { payload: { isCtrlPressed, nodeKey, nodeType } }) => {
        const updateSelection = () => {
          const oldKeys = state.selectedKeys;
          if (isCtrlPressed) {
            const theKeyShouldBeRemoved = oldKeys.includes(nodeKey);
            if (theKeyShouldBeRemoved) {
              state.selectedKeys = oldKeys.filter((key) => key !== nodeKey);
            } else {
              state.selectedKeys = [...oldKeys, nodeKey];
            }
          } else {
            const isAlreadyTheOnlyKey =
              oldKeys.length === 1 && oldKeys.includes(nodeKey);
            if (isAlreadyTheOnlyKey) {
              // keep oldKeys
            } else {
              state.selectedKeys = [nodeKey];
            }
          }
        };

        const openForm = () => {
          if (nodeType === ObjectType.Module) {
            navigate(state, "module/list", state.selectedKeys);
          } else {
            navigate(state, `${nodeType}/edit`, state.selectedKeys);
          }
        };

        updateSelection();
        if (!isCtrlPressed) {
          openForm();
        }
      }),

      clearSelection: create.reducer((state) => {
        state.selectedKeys = [];
      }),

      clear: create.reducer(() => {
        return initialState;
      }),
    };
  },

  selectors: {
    selectObjectsRoute: (state) => state.route,
    selectRouteKeys: (state) => state.routeKeys,
    selectRouteObjectKeys: (state) => state.routeObjectKeys,

    selectObjects: createSelector(
      [(state: IObjectTreeSlice) => state.objects, (_, keys: string[]) => keys],
      (objects, keys) =>
        keys
          .map((key) => treeService.getItemByKey(objects, key)!)
          .filter(skipNullable),
    ),
    selectParent: createSelector(
      [(state: IObjectTreeSlice) => state.objects, (_, key?: string) => key],
      (objects, key) => {
        const object = key && treeService.getItemByKey(objects, key);
        if (!object) return undefined;
        return treeService.getParentItem(objects, object);
      },
    ),
    selectAncestor: createSelector(
      [
        (state: IObjectTreeSlice) => state.objects,
        (_state, key?: string) => key,
        (_state, _key, type?: ObjectType) => type,
      ],
      (objects, key, type) => {
        const object = key && treeService.getItemByKey(objects, key);
        if (!object || !type) return undefined;
        return treeService.getAncestorItem(objects, object, type);
      },
    ),
    selectChildren: createSelector(
      [
        (state: IObjectTreeSlice) => state.objects,
        (_state, parent?: IStoreDataNode) => parent,
        (_state, _parent, type?: ObjectType) => type,
      ],
      (objects, parent, type) => {
        const children =
          (parent && treeService.getChildren(objects, parent)) || [];
        return type
          ? children.filter((child) => child.type === type)
          : children;
      },
    ),

    selectIsLoading: (state) => state.isLoading,
    selectTreeData: createSelector(
      (state: IObjectTreeSlice) => state.objects,
      (objects) => Objects.storeDataToUiData(objects),
    ),
    selectTreeRawData: (state) => state.objects,

    selectMovingObjects: (state) => state.movingObjects,
    selectMovingTarget: (state) => state.movingTarget,

    selectContextMenuNodes: selectContextMenuNodes_,
    selectContextMenuItems: createSelector(selectContextMenuNodes_, (nodes) =>
      getContextMenuItems(nodes),
    ),
    selectContextMenuPosition: (state) => state.contextMenuPosition,

    selectSelectedKeys: (state) => state.selectedKeys,
    selectLoadedKeys: (state) => state.loadedKeys,
    selectExpandedKeys: (state) => state.expandedKeys,
  },
});

export const {
  selectObjectsRoute,
  selectRouteKeys,
  selectRouteObjectKeys,
  selectObjects,
  selectParent,
  selectAncestor,
  selectChildren,
  selectIsLoading,
  selectTreeData,
  selectTreeRawData,
  selectMovingObjects,
  selectMovingTarget,
  selectContextMenuItems,
  selectContextMenuNodes,
  selectContextMenuPosition,
  selectSelectedKeys,
  selectLoadedKeys,
  selectExpandedKeys,
} = objectTreeSlice.selectors;

export const {
  navigate,
  loadRouteObjects,
  setTestData,
  loadInitialData,
  filterTree,
  loadNodeChildren,
  setMovingObjects,
  setMovingTarget,
  setContextMenuObjects,
  openContextMenu,
  closeContextMenu,
  clearContextMenuObjects,
  enableNode,
  disableNode,
  expandNode,
  collapseNode,
  selectNode,
  clearSelection,
  clear,
} = objectTreeSlice.actions;
