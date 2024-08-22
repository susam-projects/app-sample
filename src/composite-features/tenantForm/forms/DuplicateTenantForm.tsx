import { FC, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { useObjectCreationInProgress } from "@/common/hooks/useObjectCreationInProgress.ts";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectParent,
} from "@/feature-blocks/objectTree";

import { TenantForm } from "../components/TenantForm/TenantForm.tsx";
import {
  addTenantFormSchema,
  TTenantFormValues,
} from "../models/tenantForm.ts";
import {
  createTenant,
  loadDuplicateTenantData,
  selectChains,
  selectContainerSizes,
  selectDatabaseVersions,
  selectFormData,
  selectIsLoading,
  selectIsSubmitting,
  selectTemplates,
} from "../store/tenantForm.slice.ts";

export const DuplicateTenantForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const formData = useAppSelector(selectFormData);
  const templates = useAppSelector(selectTemplates);
  const databaseVersions = useAppSelector(selectDatabaseVersions);
  const containerSizes = useAppSelector(selectContainerSizes);
  const chains = useAppSelector(selectChains);

  const navigate = useObjectsNavigate();
  const routeTenant = useRouteObject();
  const routeServer = useRouteObjectParent();

  const { isObjectCreationInProgress, objectCreationStart } =
    useObjectCreationInProgress({ notify });

  const handleFinish = (values: TTenantFormValues) => {
    if (!routeServer) return;
    const onSuccess = () => {
      objectCreationStart();
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(createTenant({ values, routeServer, onSuccess, onError }));
  };

  const handleCancel = () => {
    navigate({ route: "" });
  };

  const formController = useForm<TTenantFormValues>({
    resolver: zodResolver(addTenantFormSchema),
    defaultValues: {
      tag: [],
    },
  });
  const { setValue, reset } = formController;

  useEffect(() => {
    if (routeTenant?.type === ObjectType.Tenant) {
      const onError = (errorMessage: string) => {
        notify.error({ message: errorMessage });
      };
      void dispatch(loadDuplicateTenantData({ routeTenant, onError }));
    }
  }, [dispatch, notify, routeTenant]);

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [setValue, formData, reset]);

  useEffect(() => {
    if (containerSizes.length && formData) {
      setValue("containerSize", formData.containerSize || "");
      reset({}, { keepValues: true }); // clean the "dirty" state
    }
  }, [setValue, containerSizes, formData, reset]);

  return (
    <>
      {notificationContext}
      <TenantForm
        formController={formController}
        title={t("tenant.form.addTenantTitle")}
        isLoading={isLoading}
        templates={templates}
        databaseVersions={databaseVersions}
        containerSizes={containerSizes}
        chainOptions={chains}
        showTags={false}
        showTenantId={false}
        showTenantSecret={false}
        onFinish={handleFinish}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText={t("common.form.buttons.create")}
        isObjectCreationInProgress={isObjectCreationInProgress}
      />
    </>
  );
};
