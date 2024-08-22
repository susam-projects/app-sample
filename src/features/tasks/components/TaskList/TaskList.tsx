import { ComponentProps, FC } from "react";

import { Collapse, Divider, Empty, Flex, Space, Typography } from "antd";

import { ITaskInfo } from "../../models/task.ts";
import { TaskState } from "../TaskState/TaskState.tsx";

import { useStyles } from "./TaskList.styles.ts";

interface ITaskListProps {
  title: string;
  tasks: ITaskInfo[];
  emptyDescription: string;
}

type TTextType = ComponentProps<typeof Typography.Text>["type"];
const TEXT_COLOR_BY_TASK_STATE: Record<ITaskInfo["state"], TTextType> = {
  progress: "secondary",
  success: "success",
  error: "danger",
};

export const TaskList: FC<ITaskListProps> = ({
  title,
  tasks,
  emptyDescription,
}) => {
  const { styles } = useStyles();

  return (
    <div>
      <Typography.Title level={5}>{title}</Typography.Title>
      {tasks.length ? (
        <Space direction="vertical" className={styles.flex}>
          <Collapse
            items={tasks.map((task) => ({
              key: task.id,
              showArrow: false,
              collapsible: task.details ? "header" : "icon",
              label: (
                <Flex justify="space-between">
                  <Space>
                    <TaskState state={task.state} />
                    <Divider type="vertical" className={styles.divider} />
                    <Typography.Text>{task.title}</Typography.Text>
                  </Space>
                </Flex>
              ),
              children: (
                <>
                  {task.details && (
                    <Typography.Text
                      type={TEXT_COLOR_BY_TASK_STATE[task.state]}
                    >
                      {task.details}
                    </Typography.Text>
                  )}
                </>
              ),
            }))}
          />
        </Space>
      ) : (
        <Empty description={emptyDescription} />
      )}
    </div>
  );
};
