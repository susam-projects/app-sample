import { FC, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import { useObjectCreationInProgress } from "@/common/hooks";
import {
  useObjectsNavigate,
  useRouteObject,
} from "@/feature-blocks/objectTree";

import { ReplicationSite } from "../components/ReplicationSite/ReplicationSite";
import { useRangeFieldValue } from "../hooks/useRangeFieldValue";
import {
  TAddReplicationSiteFormValues,
  addReplicationSiteFormValuesSchema,
} from "../models/replicationSite";
import {
  clearChildrenShopsData,
  createReplicationSite,
  loadAddReplicationSiteData,
  selectChainId,
  selectIsLoading,
  selectIsSubmitting,
  selectShopList,
} from "../store/replicationSite.slice";

export const CreateReplicationSiteForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useObjectsNavigate();
  const tenant = useRouteObject();
  const shopList = useAppSelector(selectShopList);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const chainId = useAppSelector(selectChainId);

  useEffect(() => {
    const loadData = debounce(
      () => {
        if (tenant?.id) {
          const onError = (errorMessage: string) => {
            notify.error({ message: errorMessage });
          };
          void dispatch(loadAddReplicationSiteData({ tenant, onError }));
        }
      },
      300,
      { leading: false, trailing: true },
    );
    void loadData();

    return () => {
      loadData.cancel();
    };
  }, [dispatch, notify, tenant]);

  const { handleSubmit, control, formState, reset } =
    useForm<TAddReplicationSiteFormValues>({
      resolver: zodResolver(addReplicationSiteFormValuesSchema),
    });

  useEffect(() => {
    reset();
    dispatch(clearChildrenShopsData());
  }, [tenant?.id, reset, dispatch]);

  const rangeFieldValue = useRangeFieldValue(control);

  const { isObjectCreationInProgress, objectCreationStart } =
    useObjectCreationInProgress({ notify });

  const handleFinish = (values: TAddReplicationSiteFormValues) => {
    if (!tenant || !chainId) return;
    const onSuccess = () => {
      objectCreationStart();
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      createReplicationSite({
        values,
        tenantId: tenant.id,
        chainId,
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
      <ReplicationSite
        mainShopOption={shopList}
        isDirty={formState.isDirty}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        control={control}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        rangeFieldValue={rangeFieldValue}
        title={t("replicationSite.form.title")}
        submitButtonText={t("common.form.buttons.create")}
        isObjectCreationInProgress={isObjectCreationInProgress}
        showGUID={false}
      />
    </>
  );
};
