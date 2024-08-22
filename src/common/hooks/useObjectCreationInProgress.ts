import { useState } from "react";

import { notification } from "antd";
import { useTranslation } from "react-i18next";

export const useObjectCreationInProgress = ({
  notify: externalNotify,
}: {
  notify?: ReturnType<typeof notification.useNotification>[0];
} = {}) => {
  const { t } = useTranslation();

  const [notify, notificationContext] = notification.useNotification();
  const openNotification = () => {
    (externalNotify || notify).success({
      message: t("common.objectCreationInProgress"),
      placement: "topRight",
    });
  };

  const [isObjectCreationInProgress, setIsObjectCreationInProgress] =
    useState(false);
  const objectCreationStart = () => {
    setIsObjectCreationInProgress(true);
    openNotification();
  };

  return {
    notificationContext,
    isObjectCreationInProgress,
    objectCreationStart,
  };
};
