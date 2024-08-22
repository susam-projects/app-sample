import { FC, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input, notification } from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { ObjectForm } from "@/common/components";
import { ObjectType, useRouteObject } from "@/feature-blocks/objectTree";

import {
  serverFormSchema,
  TEditServerFormValues,
} from "../models/serverForm.model.ts";
import {
  selectIsLoading,
  loadData,
  selectFormData,
} from "../store/EditServerForm.slice.ts";

export const EditServerForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const formData = useAppSelector(selectFormData);
  const { t } = useTranslation();
  const { control, reset } = useForm<TEditServerFormValues>({
    resolver: zodResolver(serverFormSchema),
  });
  const routeObject = useRouteObject();

  useEffect(() => {
    if (routeObject?.type === ObjectType.Server) {
      const onError = (errorMessage: string) => {
        notify.error({ message: errorMessage });
      };
      void dispatch(loadData({ routeObject, onError }));
    }
  }, [dispatch, notify, routeObject]);

  useEffect(() => {
    reset({
      serverName: formData.serverName,
      enabled: formData.enabled,
    });
  }, [formData, reset]);

  return (
    <>
      {notificationContext}
      <ObjectForm
        name="edit-server"
        labelCol={{ flex: "110px" }}
        colon={false}
        labelAlign="left"
        isLoading={isLoading}
        formContent={
          <>
            <FormItem
              control={control}
              label={t("server.form.serverName")}
              name="serverName"
              disabled
            >
              <Input />
            </FormItem>
          </>
        }
      />
    </>
  );
};
