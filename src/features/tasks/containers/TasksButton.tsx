import { FC, useState } from "react";

import { Button, Drawer, Space } from "antd";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/app/store";

import { TaskList } from "../components/TaskList/TaskList.tsx";
import {
  selectFinishedTasks,
  selectTaskCount,
  selectTasksInProgress,
} from "../store/tasks.slice.ts";

import { useStyles } from "./TaskButton.styles.ts";

export const TasksButton: FC = () => {
  const { styles } = useStyles();
  const { t } = useTranslation();
  const taskCount = useAppSelector(selectTaskCount);
  const tasksInProgress = useAppSelector(selectTasksInProgress);
  const finishedTasks = useAppSelector(selectFinishedTasks);

  const [open, setOpen] = useState(false);

  const handleOpenRequest = () => {
    setOpen(true);
  };

  const handleCloseRequest = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpenRequest}>
        {t("tasks.tasksButton", { taskCount })}
      </Button>
      <Drawer title={t("tasks.title")} onClose={handleCloseRequest} open={open}>
        <Space direction="vertical" size="large" className={styles.flex}>
          <TaskList
            title={t("tasks.sections.inProgressTitle")}
            tasks={tasksInProgress}
            emptyDescription={t("tasks.sections.inProgressEmpty")}
          />
          <TaskList
            title={t("tasks.sections.finishedTitle")}
            tasks={finishedTasks}
            emptyDescription={t("tasks.sections.finishedEmpty")}
          />
        </Space>
      </Drawer>
    </>
  );
};
