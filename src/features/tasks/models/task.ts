export interface ITaskInfo {
  id: string;
  title: string;
  state: "progress" | "success" | "error";
  details?: string;
  subTasks?: ITaskInfo[];
}
