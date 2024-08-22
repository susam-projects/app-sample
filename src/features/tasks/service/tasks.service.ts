import { ITaskInfo } from "../models/task.ts";

export const createTask = (id: string, title: string): ITaskInfo => {
  return {
    id,
    title,
    state: "progress",
  };
};

export const createUnknownTask = (
  subscriptionName: string,
  actionId: string,
  state: ITaskInfo["state"],
  details: string | undefined,
): ITaskInfo => {
  return {
    id: createTaskId(subscriptionName, actionId),
    state,
    title: "",
    details,
  };
};

export const createTaskFromUnknownTask = (
  unknownTask: ITaskInfo,
  title: string,
): ITaskInfo => {
  return {
    ...unknownTask,
    title,
  };
};

export const createTaskId = (subscriptionName: string, actionId: string) => {
  return `${subscriptionName}-${actionId}`;
};
