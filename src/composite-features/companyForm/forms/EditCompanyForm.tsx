import { FC, useEffect, useMemo } from "react";

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
import { StatusBar } from "@/features/statusBar";

import { Company } from "../components/Company/Company.tsx";
import {
  companyFormValuesSchema,
  TCompanyFormValues,
} from "../models/companyForm.ts";
import {
  loadCompany,
  selectCompany,
  selectHistory,
  selectIsLoading,
  selectIsSubmitting,
  updateCompany,
} from "../store/companyForm.slice.tsx";

export const EditCompanyForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const companyData = useAppSelector(selectCompany);
  const history = useAppSelector(selectHistory);
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

  const { handleSubmit, control, getValues, reset, formState } =
    useForm<TCompanyFormValues>({
      resolver: zodResolver(companyFormValuesSchema),
      defaultValues,
    });

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
    if (!company) return;
    const values = getValues();
    const onSuccess = () => {
      notify.success({ message: t("company.success.updatingCompany") });
      reset(values); // clean the "dirty" state
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      updateCompany({
        tenantId: tenant?.id || "",
        companyId: company.id || "",
        routeObject: company,
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
      <Company
        header={<StatusBar tenant={tenant} />}
        control={control}
        history={history}
        isLoading={isLoading}
        shouldDisableSubmit={!formState.isDirty}
        isSubmitting={isSubmitting}
        submitButtonText={t("common.form.buttons.save")}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        onDeleteButton={deleteHandler}
      />
    </>
  );
};
