import { FC, useEffect, useMemo } from "react";

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
} from "@/feature-blocks/objectTree";
import { StatusBar } from "@/features/statusBar";

import { DeviceFormUI } from "../components/CreateDevice/DeviceFormUI.tsx";
import {
  deviceFormValuesSchema,
  TDeviceFormValues,
} from "../models/deviceForm.ts";
import {
  loadData,
  selectDevice,
  selectDeviceHistory,
  selectDeviceTypes,
  selectIsLoading,
  selectIsSubmitting,
  updateDevice,
} from "../store/editDevice.slice.tsx";

export const EditDeviceForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const deviceData = useAppSelector(selectDevice);
  const deviceHistory = useAppSelector(selectDeviceHistory);
  const deviceTypeOptions = useAppSelector(selectDeviceTypes);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const device = useRouteObject();
  const shop = useRouteObjectAncestor({ type: ObjectType.Shop });
  const replicationSite = useRouteObjectAncestor({
    type: ObjectType.ReplicationSite,
  });
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });

  const deviceDefaultValues: TDeviceFormValues = useMemo(
    () => ({
      deviceType: "",
      displayName: "",
      deviceNumber: 0,
    }),
    [],
  );

  const { handleSubmit, control, getValues, reset, formState } =
    useForm<TDeviceFormValues>({
      resolver: zodResolver(deviceFormValuesSchema),
      defaultValues: deviceDefaultValues,
    });

  useEffect(() => {
    if (device?.type !== ObjectType.Device) return;
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(loadData({ routeObject: device, onError }));
  }, [device, dispatch, notify]);

  useEffect(() => {
    if (!deviceData) return;
    reset(deviceData);
  }, [deviceData, reset]);

  const handleFinish = () => {
    if (!device) return;
    const values = getValues();
    const onSuccess = () => {
      notify.success({ message: t("device.success.updatingDevice") });
      reset(values); // clean the "dirty" state
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      updateDevice({
        shopId: shop?.id || "",
        tenantId: tenant?.id || "",
        deviceId: device.id,
        routeObject: device,
        values,
        onSuccess,
        onError,
      }),
    );
  };

  const handleCancel = () => {
    navigate({ route: "" });
  };

  const deleteHandler = () => {
    console.log("delete object in progress");
  };

  return (
    <>
      {notificationContext}
      <DeviceFormUI
        header={
          <StatusBar
            tenant={tenant}
            replicationSite={replicationSite}
            shop={shop}
          />
        }
        control={control}
        history={deviceHistory}
        deviceTypeOptions={deviceTypeOptions}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        shouldDisableSubmit={!formState.isDirty}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        displayNameLabel={t("device.form.displayName")}
        submitButtonText={t("common.form.buttons.save")}
        onDeleteButton={deleteHandler}
      />
    </>
  );
};
