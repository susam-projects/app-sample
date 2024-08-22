import { FC, useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { ISelectOption } from "@/common/types";
import {
  forceSynchronization,
  loadEditTenantData,
  selectChains,
  selectContainerSizes,
  selectFormData,
  selectIsLoading,
  selectIsSubmitting,
  selectTenantHistory,
  updateTenant,
} from "@/composite-features/tenantForm/store/tenantForm.slice.ts";
import {
  ObjectType,
  useRouteObject,
  useObjectsNavigate,
} from "@/feature-blocks/objectTree";
import { StatusBar } from "@/features/statusBar";

import { TenantForm } from "../components/TenantForm/TenantForm.tsx";
import {
  editTenantFormSchema,
  TTenantFormValues,
} from "../models/tenantForm.ts";

const TAG_OPTIONS: ISelectOption[] = [
  { label: "TAG-1", value: "TAG-1" },
  { label: "TAG-2", value: "TAG-2" },
  { label: "TAG-3", value: "TAG-3" },
];

export const EditTenantForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const formData = useAppSelector(selectFormData);
  const history = useAppSelector(selectTenantHistory);
  const containerSizes = useAppSelector(selectContainerSizes);
  const chains = useAppSelector(selectChains);
  const navigate = useObjectsNavigate();
  const routeObject = useRouteObject();

  const handleFinish = (values: TTenantFormValues) => {
    if (!routeObject) return;
    const onSuccess = () => {
      notify.success({ message: t("tenant.success.updatingTenant") });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    reset(values); // clean the "dirty" state
    void dispatch(
      updateTenant({
        routeObject,
        values,
        onSuccess,
        onError,
      }),
    );
  };

  const handleCancel = () => {
    navigate({ route: "" });
  };

  const formController = useForm<TTenantFormValues>({
    resolver: zodResolver(editTenantFormSchema),
    defaultValues: {
      tag: [],
    },
  });
  const { setValue, reset } = formController;

  useEffect(() => {
    if (routeObject?.type === ObjectType.Tenant) {
      const onError = (errorMessage: string) => {
        notify.error({ message: errorMessage });
      };
      void dispatch(loadEditTenantData({ routeObject, onError }));
    }
  }, [dispatch, notify, routeObject]);

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

  const deleteHandler = () => {
    console.log("delete object in progress");
  };

  const forceSynchronizationHandler = useCallback(() => {
    if (!routeObject) return;
    const onSuccess = () => {
      notify.success({ message: t("forceSynchronization.success") });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };

    void dispatch(
      forceSynchronization({
        tenantId: routeObject.id,
        tenantName: routeObject.title,
        onSuccess,
        onError,
      }),
    );
  }, [dispatch, notify, routeObject, t]);

  const debouncedForceSynchronizationHandler = useMemo(
    () =>
      debounce(forceSynchronizationHandler, 1000, {
        leading: true,
        trailing: false,
      }),
    [forceSynchronizationHandler],
  );

  useEffect(() => {
    return () => {
      debouncedForceSynchronizationHandler.cancel();
    };
  }, [debouncedForceSynchronizationHandler]);

  return (
    <>
      {notificationContext}
      <TenantForm
        header={<StatusBar tenant={routeObject} />}
        isLoading={isLoading}
        formController={formController}
        tagOptions={TAG_OPTIONS}
        history={history}
        containerSizes={containerSizes}
        chainOptions={chains}
        canEditTemplate={false}
        showTechnicalName
        onFinish={handleFinish}
        onCancel={handleCancel}
        onForceSynchronization={debouncedForceSynchronizationHandler}
        isSubmitting={isSubmitting}
        submitButtonText={t("common.form.buttons.save")}
        onDeleteButton={deleteHandler}
        disableSubmitIfFormNotDirty
      />
    </>
  );
};
