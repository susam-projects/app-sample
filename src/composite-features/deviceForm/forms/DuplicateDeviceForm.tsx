import { FC, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectAncestor,
  useRouteObjectParent,
} from "@/feature-blocks/objectTree";

import { DeviceFormUI } from "../components/CreateDevice/DeviceFormUI.tsx";
import {
  deviceFormValuesSchema,
  TDeviceFormValues,
} from "../models/deviceForm.ts";
import {
  createDevice,
  loadData,
  selectDevice,
  selectDeviceTypes,
  selectIsLoading,
  selectIsSubmitting,
} from "../store/duplicateDevice.slice.tsx";

export const DuplicateDeviceForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useObjectsNavigate();
  const routeDevice = useRouteObject();
  const routeShop = useRouteObjectParent();
  const routeTenant = useRouteObjectAncestor({ type: ObjectType.Tenant });
  const dispatch = useAppDispatch();
  const deviceData = useAppSelector(selectDevice);
  const deviceTypeOptions = useAppSelector(selectDeviceTypes);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);

  const deviceDefaultValues: TDeviceFormValues = useMemo(
    () => ({
      deviceType: "",
      displayName: "",
      deviceNumber: undefined,
    }),
    [],
  );

  const { handleSubmit, control, getValues, setValue, reset } =
    useForm<TDeviceFormValues>({
      resolver: zodResolver(deviceFormValuesSchema),
      defaultValues: deviceDefaultValues,
    });

  useEffect(() => {
    if (routeDevice?.type !== ObjectType.Device) return;
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(loadData({ routeDevice, onError }));
  }, [dispatch, notify, routeDevice, routeShop]);

  useEffect(() => {
    if (!deviceData) return;
    reset({
      ...deviceData,
      deviceNumber: undefined,
    });
  }, [deviceData, reset, setValue]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFinish = () => {
    const values = getValues();
    const onSuccess = () => {
      notify.success({ message: t("device.success.creatingDevice") });
      setIsSubmitted(true);
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      createDevice({
        shopId: routeShop?.id || "",
        tenantId: routeTenant?.id || "",
        values,
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
      <DeviceFormUI
        title={t("device.form.addNewDevice")}
        control={control}
        deviceTypeOptions={deviceTypeOptions}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        shouldDisableAll={isSubmitted}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        displayNameLabel={t("device.form.proposalName")}
        submitButtonText={t("common.form.buttons.create")}
      />
    </>
  );
};
