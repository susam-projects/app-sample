import { FC, useState } from "react";

import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { EMPTY_TITLE } from "@/common/constants";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObjectAncestor,
  useRouteObjectParent,
  useRouteObjects,
} from "@/feature-blocks/objectTree";

import { ModuleCopyConfiguration } from "../components/ModuleCopyConfiguration/ModuleCopyConfiguration.tsx";
import {
  copyConfiguration,
  selectIsSubmitting,
} from "../store/moduleForm.slice.ts";

export const ModuleCopyConfigurationForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const modules = useRouteObjects();
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });
  const shop = useRouteObjectParent();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleConfirm = () => {
    if (
      !modules.length ||
      tenant?.type !== ObjectType.Tenant ||
      shop?.type !== ObjectType.Shop
    ) {
      return;
    }

    const onSuccess = () => {
      notify.success({ message: t("module.success.setStatus") });
      setIsSubmitted(true);
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };

    void dispatch(
      copyConfiguration({
        modules,
        tenantId: tenant?.id || "",
        shopId: shop?.id || "",
        onSuccess,
        onError,
      }),
    );
  };

  const handleCancel = () => {
    navigate({ route: "" });
  };

  return (
    <>
      {notificationContext}
      <ModuleCopyConfiguration
        tenantName={tenant?.title || EMPTY_TITLE}
        modulesCount={modules.length}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
      />
    </>
  );
};
