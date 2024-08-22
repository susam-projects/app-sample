import { FC, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { DeepPartial, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectAncestor,
} from "@/feature-blocks/objectTree";

import { Company } from "../components/Company/Company.tsx";
import {
  companyFormValuesSchema,
  TCompanyFormValues,
} from "../models/companyForm.ts";
import {
  createCompany,
  loadCompany,
  selectCompany,
  selectIsLoading,
  selectIsSubmitting,
} from "../store/companyForm.slice.tsx";

export const DuplicateCompanyForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const companyData = useAppSelector(selectCompany);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const company = useRouteObject();
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });

  const defaultValues: DeepPartial<TCompanyFormValues> = useMemo(
    () => ({
      companyName: "",
      finYearEndDate: "",
      isEnabled: true,
    }),
    [],
  );

  const { handleSubmit, control, getValues, reset } =
    useForm<TCompanyFormValues>({
      resolver: zodResolver(companyFormValuesSchema),
      defaultValues,
    });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (company?.type !== ObjectType.Company) return;
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(loadCompany({ routeObject: company, onError }));
  }, [company, dispatch, notify]);

  useEffect(() => {
    reset(companyData);
  }, [companyData, reset]);

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
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        submitButtonText={t("common.form.buttons.create")}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
      />
    </>
  );
};
