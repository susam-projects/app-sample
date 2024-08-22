import { FC, useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { THandleSubmit } from "@/common/components";
import {
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectParent,
} from "@/feature-blocks/objectTree";
import { StatusBar } from "@/features/statusBar";

import { ReplicationSite } from "../components/ReplicationSite/ReplicationSite";
import { useRangeFieldValue } from "../hooks/useRangeFieldValue";
import {
  TEditReplicationSiteFormValues,
  editReplicationSiteFormValuesSchema,
} from "../models/replicationSite";
import {
  clearChildrenShopsData,
  loadEditDuplicateReplicationSiteData,
  selectChainId,
  selectShopList,
  selectIsLoading,
  selectIsSubmitting,
  selectReplicationSiteData,
  updateReplicationSite,
  forceSynchronization,
} from "../store/replicationSite.slice";

export const EditReplicationSiteForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useObjectsNavigate();
  const dispatch = useAppDispatch();
  const shopList = useAppSelector(selectShopList);
  const replicationSiteData = useAppSelector(selectReplicationSiteData);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const chainId = useAppSelector(selectChainId);
  const routeObject = useRouteObject();
  const tenant = useRouteObjectParent();

  useEffect(() => {
    if (tenant && routeObject?.type === ObjectType.ReplicationSite) {
      const onError = (errorMessage: string) => {
        notify.error({ message: errorMessage });
      };
      void dispatch(
        loadEditDuplicateReplicationSiteData({
          routeReplicationSite: routeObject,
          routeTenant: tenant,
          onError,
        }),
      );
    }
  }, [dispatch, notify, routeObject, tenant]);

  const { handleSubmit, control, reset, formState } =
    useForm<TEditReplicationSiteFormValues>({
      resolver: zodResolver(editReplicationSiteFormValuesSchema),
    });

  useEffect(() => {
    reset();
    dispatch(clearChildrenShopsData());
  }, [routeObject?.id, reset, dispatch]);

  useEffect(() => {
    if (replicationSiteData) {
      reset(replicationSiteData);
    }
  }, [replicationSiteData, reset]);

  const rangeFieldValue = useRangeFieldValue(control);

  const handleFinish = (values: TEditReplicationSiteFormValues) => {
    if (!routeObject || !tenant || !chainId) return;
    const onSuccess = () => {
      notify.success({
        message: t("replicationSite.success.updatingReplicationSite"),
      });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    reset(values); // clean the "dirty" state
    void dispatch(
      updateReplicationSite({
        routeReplicationSite: routeObject,
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

  const deleteHandler = () => {
    console.log("delete object in progress");
  };

  const forceSynchronizationHandler = useCallback(() => {
    if (!routeObject || !tenant) return;
    const onSuccess = () => {
      notify.success({ message: t("forceSynchronization.success") });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };

    void dispatch(
      forceSynchronization({
        tenantId: tenant.id,
        replicationSiteId: routeObject.id,
        replicationSiteName: routeObject.title,
        onSuccess,
        onError,
      }),
    );
  }, [dispatch, notify, routeObject, t, tenant]);

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
      <ReplicationSite
        header={<StatusBar tenant={tenant} replicationSite={routeObject} />}
        mainShopOption={shopList}
        control={control}
        isDirty={formState.isDirty}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        rangeFieldValue={rangeFieldValue}
        submitButtonText={t("common.form.buttons.save")}
        disabledFields={{
          baseId: true,
          genVersion: true,
          guId: true,
          siteType: true,
          thirdPartyCode: true,
          sender: true,
          versionIdEnd: true,
          versionIdStart: true,
        }}
        onForceSynchronization={debouncedForceSynchronizationHandler}
        onDeleteButton={deleteHandler}
        disableSubmitIfFormNotDirty
      />
    </>
  );
};
