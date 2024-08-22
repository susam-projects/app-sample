import { FC, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { DeepPartial, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import {
  useObjectsNavigate,
  useRouteObject,
} from "@/feature-blocks/objectTree";

import { Company } from "../components/Company/Company.tsx";
import {
  companyFormValuesSchema,
  TCompanyFormValues,
} from "../models/companyForm.ts";
import {
  createCompany,
  selectIsSubmitting,
} from "../store/companyForm.slice.tsx";

export const AddCompanyForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const tenant = useRouteObject();

  const defaultValues: DeepPartial<TCompanyFormValues> = useMemo(
    () => ({
      companyName: "",
      finYearEndDate: "",
    }),
    [],
  );

  const { handleSubmit, control, getValues } = useForm<TCompanyFormValues>({
    resolver: zodResolver(companyFormValuesSchema),
    defaultValues,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFinish = () => {
    if (!tenant) return;
    const values = getValues();
    const onSuccess = () => {
      notify.success({ message: t("company.success.creatingCompany") });
      setIsSubmitted(true);
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      createCompany({
        tenantId: tenant.id,
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
      <Company
        title={t("company.form.title")}
        control={control}
        shouldDisableAll={isSubmitted}
        isSubmitting={isSubmitting}
        submitButtonText={t("common.form.buttons.create")}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
      />
    </>
  );
};
