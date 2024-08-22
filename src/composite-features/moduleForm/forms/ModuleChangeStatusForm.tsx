import { FC, useState } from "react";

import { notification } from "antd";
import first from "lodash/first";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectIsSubmitting,
  setModulesStatus,
} from "@/composite-features/moduleForm/store/moduleForm.slice.ts";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObjectAncestor,
  useRouteObjectParent,
  useRouteObjects,
} from "@/feature-blocks/objectTree";

import { ModuleChangeStatus } from "../components/ModuleChangeStatus/ModuleChangeStatus.tsx";

export const ModuleChangeStatusForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const modules = useRouteObjects();
  const shop = useRouteObjectParent();
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });

  const isEnabled = first(modules)?.isEnabled;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = () => {
    setIsSubmitted(false);
  };

  const handleCancel = () => {
    navigate({ route: "" });
  };

  const handleSubmit = (isModuleEnabled: boolean) => {
    const onSuccess = () => {
      notify.success({ message: t("module.success.setStatus") });
      setIsSubmitted(true);
    };
    const onWarning = (message: string) => {
      notify.warning({ message });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      setModulesStatus({
        tenantId: tenant?.id || "",
        shopId: shop?.id || "",
        modules,
        status: !isModuleEnabled,
        onSuccess,
        onWarning,
        onError,
      }),
    );
  };

  return (
    <>
      {notificationContext}
      <ModuleChangeStatus
        defaultValue={!!isEnabled}
        onChange={handleChange}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
      />
    </>
  );
};
