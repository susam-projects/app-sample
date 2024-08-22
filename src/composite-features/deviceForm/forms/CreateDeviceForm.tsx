import { FC, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import first from "lodash/first";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectAncestor,
} from "@/feature-blocks/objectTree";

import { DeviceFormUI } from "../components/CreateDevice/DeviceFormUI.tsx";
import {
  deviceFormValuesSchema,
  TDeviceFormValues,
} from "../models/deviceForm.ts";
import {
  createDevice,
  loadData,
  selectDeviceTypes,
  selectIsLoading,
  selectIsSubmitting,
} from "../store/createDevice.slice.tsx";

export const CreateDeviceForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useObjectsNavigate();
  const shop = useRouteObject();
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });
  const dispatch = useAppDispatch();
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

  const { handleSubmit, control, getValues, setValue } =
    useForm<TDeviceFormValues>({
      resolver: zodResolver(deviceFormValuesSchema),
      defaultValues: deviceDefaultValues,
    });

  const deviceType = useWatch({ control, name: "deviceType" });
  useEffect(() => {
    setValue("displayName", `${deviceType}`);
  }, [deviceType, setValue]);

  useEffect(() => {
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(loadData({ onError }));
  }, [dispatch, notify]);

  useEffect(() => {
    if (deviceTypeOptions.length) {
      setValue("deviceType", first(deviceTypeOptions)!.value);
    }
  }, [deviceTypeOptions, setValue]);

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
        shopId: shop?.id || "",
        tenantId: tenant?.id || "",
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
