import { FC, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import { EMPTY_TITLE } from "@/common/constants";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectAncestor,
  useRouteObjectSiblings,
} from "@/feature-blocks/objectTree";
import { StatusBar } from "@/features/statusBar";

import { ModuleList } from "../components/ModuleList/ModuleList.tsx";
import {
  moduleListFormValuesSchema,
  TModuleListFormValues,
} from "../models/formSchema.ts";
import { treeModulesToModuleListItems } from "../service/moduleList.mappers.ts";
import {
  selectIsLoading,
  selectIsSubmitting,
  updateModules,
} from "../store/moduleForm.slice.ts";

export const ModuleListForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const { parent: shop, siblings: modules } = useRouteObjectSiblings({
    type: ObjectType.Module,
  });
  const replicationSite = useRouteObjectAncestor({
    type: ObjectType.ReplicationSite,
  });
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });
  const routeObject = useRouteObject();

  const { handleSubmit, control, getValues, reset, setValue } =
    useForm<TModuleListFormValues>({
      resolver: zodResolver(moduleListFormValuesSchema),
    });

  const { fields: modulesList } = useFieldArray<
    TModuleListFormValues,
    "modules"
  >({
    control,
    name: "modules",
  });

  useEffect(() => {
    // TODO: that's a temporary solution, which does not have all module data
    //      will need to use moduleListData in the end, probably
    const modulesFromTheTree = treeModulesToModuleListItems(modules);
    reset({ modules: modulesFromTheTree });
  }, [modules, reset]);

  const handleFinish = () => {
    const values = getValues();
    const onSuccess = () => {
      notify.success({ message: t("module.success.setStatus") });
    };
    const onWarning = (message: string) => {
      notify.warning({ message });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    const modulesFromTree = treeModulesToModuleListItems(modules);
    void dispatch(
      updateModules({
        tenantId: tenant?.id || "",
        shopId: shop?.id || "",
        originalModules: modules,
        prevModules: modulesFromTree,
        newModules: values.modules,
        onSuccess,
        onWarning,
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
      <ModuleList
        header={
          <StatusBar
            tenant={tenant}
            replicationSite={replicationSite}
            shop={shop}
          />
        }
        control={control}
        shopName={shop?.title || EMPTY_TITLE}
        submitButtonText={t("common.form.buttons.confirm")}
        modules={modulesList}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        setValue={setValue}
        selectedModuleId={routeObject?.id}
      />
    </>
  );
};
