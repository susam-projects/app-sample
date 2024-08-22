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
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectParent,
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
  loadEditDuplicateReplicationSiteData,
  selectChainId,
  selectIsLoading,
  selectIsSubmitting,
  selectReplicationSiteData,
  selectShopList,
} from "../store/replicationSite.slice";

export const DuplicateReplicationSiteForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useObjectsNavigate();
  const routeReplicationSite = useRouteObject();
  const routeTenant = useRouteObjectParent();
  const shopList = useAppSelector(selectShopList);
  const replicationSiteData = useAppSelector(selectReplicationSiteData);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const chainId = useAppSelector(selectChainId);

  useEffect(() => {
    const loadData = debounce(
      () => {
        if (
          routeTenant?.id &&
          routeReplicationSite?.type === ObjectType.ReplicationSite
        ) {
          const onError = (errorMessage: string) => {
            notify.error({ message: errorMessage });
          };
          void dispatch(
            loadEditDuplicateReplicationSiteData({
              routeReplicationSite,
              routeTenant,
              onError,
            }),
          );
        }
      },
      300,
      { leading: false, trailing: true },
    );
    void loadData();

    return () => {
      loadData.cancel();
    };
  }, [dispatch, notify, routeReplicationSite, routeTenant]);

  const { handleSubmit, control, formState, reset, setValue } =
    useForm<TAddReplicationSiteFormValues>({
      resolver: zodResolver(addReplicationSiteFormValuesSchema),
    });

  useEffect(() => {
    reset();
    dispatch(clearChildrenShopsData());
  }, [routeReplicationSite?.id, reset, dispatch]);

  useEffect(() => {
    if (replicationSiteData) {
      reset(replicationSiteData);
      setValue("guId", undefined);
      setValue("genVersion", undefined);
    }
  }, [replicationSiteData, reset, setValue]);

  const rangeFieldValue = useRangeFieldValue(control);

  const { isObjectCreationInProgress, objectCreationStart } =
    useObjectCreationInProgress({ notify });

  const handleFinish = (values: TAddReplicationSiteFormValues) => {
    if (!routeTenant || !chainId) return;
    const onSuccess = () => {
      objectCreationStart();
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      createReplicationSite({
        values,
        tenantId: routeTenant.id,
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
