import { FC, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import first from "lodash/first";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { useOnMount } from "@/common/hooks";
import { useObjectCreationInProgress } from "@/common/hooks/useObjectCreationInProgress.ts";
import {
  useObjectsNavigate,
  useRouteObject,
} from "@/feature-blocks/objectTree";

import { TenantForm } from "../components/TenantForm/TenantForm.tsx";
import {
  addTenantFormSchema,
  TTenantFormValues,
} from "../models/tenantForm.ts";
import {
  createTenant,
  loadAddTenantData,
  selectChains,
  selectContainerSizes,
  selectDatabaseVersions,
  selectIsLoading,
  selectIsSubmitting,
  selectTemplates,
} from "../store/tenantForm.slice.ts";

export const AddTenantForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const templates = useAppSelector(selectTemplates);
  const databaseVersions = useAppSelector(selectDatabaseVersions);
  const containerSizes = useAppSelector(selectContainerSizes);
  const chains = useAppSelector(selectChains);

  const navigate = useObjectsNavigate();
  const routeServer = useRouteObject();

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
      databaseVersion: undefined,
    },
  });
  const { setValue } = formController;

  useOnMount(() => {
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(loadAddTenantData({ onError }));
  });

  // TODO: uncomment when / if the field is enabled
  // useEffect(() => {
  //   if (containerSizes.length) {
  //     setValue("containerSize", first(containerSizes)!);
  //   }
  // }, [setValue, containerSizes]);

  useEffect(() => {
    if (chains.length) {
      setValue("chain", first(chains)!.value);
    }
  }, [setValue, chains]);

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
