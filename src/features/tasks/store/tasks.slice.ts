import isNil from "lodash/isNil";

import { createAppSlice, store } from "@/app/store";
import { IChangeResponse } from "@/common/api";
import {
  IMessageBusCallbackParams,
  messageBus,
} from "@/feature-blocks/messageBus";

import { ITaskInfo } from "../models/task.ts";
import {
  finishedTasksStore,
  messageBusesStore,
  tasksInProgressStore,
} from "../service/sessionStores.service.ts";
import {
  createTask,
  createTaskFromUnknownTask,
  createTaskId,
  createUnknownTask,
} from "../service/tasks.service.ts";

export interface ITasksSlice {
  inProgress: ITaskInfo[];
  finished: ITaskInfo[];
  unknown: ITaskInfo[]; // for the case when messageBus receives info before the task was properly added
}

const EMPTY_STATE: ITasksSlice = {
  inProgress: [],
  finished: [],
  unknown: [],
};

const ON_MESSAGE_BUS_MESSAGE = ({
  subscriptionName,
  actionId,
  isError,
  details,
}: IMessageBusCallbackParams) => {
  store.dispatch(
    updateTask({
      subscriptionName,
      actionId,
      status: isError ? "error" : "success",
      details: details || undefined,
    }),
  );
};

const init = () => {
  const inProgress = tasksInProgressStore.getAll();
  const finished = finishedTasksStore.getAll();
  const initialState: ITasksSlice = {
    ...EMPTY_STATE,
    inProgress,
    finished,
  };

  const messageBusesInfo = messageBusesStore.getAll();
  messageBusesInfo.forEach(({ serviceBusUrl = "", subscriptionName = "" }) => {
    if (!serviceBusUrl || !subscriptionName) return;
    messageBus.subscribeTo(
      serviceBusUrl,
      subscriptionName,
      ON_MESSAGE_BUS_MESSAGE,
    );
  });

  return { initialState };
};

const { initialState } = init();

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState,

  reducers: (create) => ({
    addTask: create.reducer<{ title: string; changeInfo: IChangeResponse }>(
      (state, { payload: { title, changeInfo } }) => {
        const taskId = createTaskId(
          changeInfo?.subscriptionName || "",
          changeInfo?.idAction || "",
        );
        const unknownTask = state.unknown.find((task) => task.id === taskId);
        if (unknownTask) {
          state.finished.push(createTaskFromUnknownTask(unknownTask, title));
          return;
        }

        state.inProgress.push(createTask(taskId, title));
        tasksInProgressStore.save(state.inProgress);

        const serviceBusUrl = changeInfo?.webhookUrl || "";
        const subscriptionName = changeInfo?.subscriptionName || "";
        messageBusesStore.add(serviceBusUrl, subscriptionName);
        messageBus.subscribeTo(
          serviceBusUrl,
          subscriptionName,
          ON_MESSAGE_BUS_MESSAGE,
        );
      },
    ),

    updateTask: create.reducer<{
      subscriptionName: string;
      actionId: string;
      status: ITaskInfo["state"];
      details?: string;
    }>(
      (state, { payload: { subscriptionName, actionId, status, details } }) => {
        const taskId = createTaskId(subscriptionName, actionId);
        const taskIndex = state.inProgress.findIndex(
          (task) => task.id === taskId,
        );
        if (taskIndex === -1) {
          const unknownTask = createUnknownTask(
            subscriptionName,
            actionId,
            status,
            details,
          );
          state.unknown.push(unknownTask);
          console.warn(
            "tasks.slice#updateTask: received unknown task!",
            unknownTask,
          );
          return;
        }

        const task = state.inProgress[taskIndex];
        state.inProgress.splice(taskIndex, 1);

        task.state = status;
        if (!isNil(details)) {
          task.details = details;
        }
        state.finished.push(task);

        tasksInProgressStore.save(state.inProgress);
        finishedTasksStore.save(state.finished);
      },
    ),

    clearTasksSlice: create.reducer(() => {
      messageBus.clear();
      tasksInProgressStore.clear();
      finishedTasksStore.clear();
      messageBusesStore.clear();
      return EMPTY_STATE;
    }),
  }),

  selectors: {
    selectTaskCount: (state) => state.inProgress.length,
    selectTasksInProgress: (state) => state.inProgress,
    selectFinishedTasks: (state) => state.finished,
  },
});

export const { selectTaskCount, selectTasksInProgress, selectFinishedTasks } =
  tasksSlice.selectors;

export const { addTask, updateTask, clearTasksSlice } = tasksSlice.actions;
