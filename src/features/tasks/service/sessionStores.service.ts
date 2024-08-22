import { ss } from "@/common/localStorageClient";

import { ITaskInfo } from "../models/task.ts";

class SessionStore<TState extends object> {
  constructor(private _name: string) {}

  protected getState() {
    return ss.getJson(this._name) as TState;
  }

  protected setState(value: TState) {
    return ss.setJson(this._name, value);
  }

  clear() {
    ss.remove(this._name);
  }
}

class MessageBusesStore extends SessionStore<Record<string, string[]>> {
  getAll() {
    const state = this.getState() || {};
    return Object.entries(state).flatMap(([subscriptionName, urls]) => {
      return urls.map((url) => ({
        subscriptionName,
        serviceBusUrl: url,
      }));
    });
  }

  add(serviceBusUrl: string, subscriptionName: string) {
    const state = this.getState() || {};
    const urls = (state[subscriptionName] = state[subscriptionName] || []);
    if (urls.indexOf(serviceBusUrl) === -1) {
      urls.push(serviceBusUrl);
    }
    this.setState(state);
  }
}

class TasksStore extends SessionStore<ITaskInfo[]> {
  getAll() {
    return this.getState() || [];
  }

  save(tasks: ITaskInfo[]) {
    this.setState(tasks);
  }
}

export const messageBusesStore = new MessageBusesStore("message_buses");
export const tasksInProgressStore = new TasksStore("tasks_in_progress");
export const finishedTasksStore = new TasksStore("finished_tasks");
