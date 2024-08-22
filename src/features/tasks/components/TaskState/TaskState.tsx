import { FC } from "react";

import {
  CheckOutlined,
  CloseOutlined,
  EllipsisOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { ITaskInfo } from "@/features/tasks/models/task.ts";

import { useStyles } from "./TaskState.styles.ts";

export const TaskState: FC<{ state: ITaskInfo["state"] }> = ({ state }) => {
  const { styles } = useStyles();

  switch (state) {
    case "progress":
      return <LoadingOutlined className={styles.progressIcon} spin />;
    case "success":
      return <CheckOutlined className={styles.finishedIcon} />;
    case "error":
      return <CloseOutlined className={styles.errorIcon} />;
    default:
      return <EllipsisOutlined />;
  }
};
