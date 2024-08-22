import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import debounce from "lodash/debounce";
import last from "lodash/last";
import { DeepPartial, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { IHATEOASItem } from "@/common/api";
import { THandleSubmit } from "@/common/components";
import { ISelectOption } from "@/common/types";
import {
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectAncestor,
  ObjectType,
  useRouteObjectSiblingsByAncestor,
  Objects,
} from "@/feature-blocks/objectTree";
import { StatusBar } from "@/features/statusBar";

import { EditShop } from "../components/EditShop/EditShop";
import { TEditShopFormValues, editShopFormValuesSchema } from "../models/shop";
import {
  createLogicalStockGroup,
  forceSynchronization,
  loadEditShopData,
  loadLogicalStockGroup,
  selectChain,
  selectIsLoading,
  selectIsSubmitting,
  selectPumpGroup,
  selectShopData,
  selectShopHistory,
  updateShop,
} from "../store/shop.slice";

import { NewPumpGroupModalForm } from "./NewPumpGroupModalForm";

const TAG_OPTIONS: ISelectOption[] = [
  { label: "TAG-1", value: "TAG-1" },
  { label: "TAG-2", value: "TAG-2" },
  { label: "TAG-3", value: "TAG-3" },
];

export const EditShopForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pumpGroupOption = useAppSelector(selectPumpGroup);
  const chainOption = useAppSelector(selectChain);
  const shopData = useAppSelector(selectShopData);
  const shopHistory = useAppSelector(selectShopHistory);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const navigate = useObjectsNavigate();
  const routeObject = useRouteObject();
  const [openNewPumpGroupModal, setOpenNewPumpGroupModal] = useState(false);
  const replicationSite = useRouteObjectAncestor({
    type: ObjectType.ReplicationSite,
  });
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });
  const { siblings: replicationSites } = useRouteObjectSiblingsByAncestor({
    type: ObjectType.ReplicationSite,
    ancestorType: ObjectType.Tenant,
  });
  const { siblings: companies } = useRouteObjectSiblingsByAncestor({
    type: ObjectType.Company,
    ancestorType: ObjectType.Tenant,
  });
  const replicationSiteOption =
    Objects.storeNodeToSelectOptions(replicationSites);
  const companyOption = Objects.storeNodeToSelectOptions(companies);

  useEffect(() => {
    if (routeObject?.type === ObjectType.Shop && tenant) {
      const onError = (errorMessage: string) => {
        notify.error({ message: errorMessage });
      };
      void dispatch(loadEditShopData({ routeObject, tenant, onError }));
    }
  }, [dispatch, notify, routeObject, tenant]);

  const showPumpGroupModal = () => {
    setOpenNewPumpGroupModal(true);
  };

  const hidePumpGroupModal = () => {
    setOpenNewPumpGroupModal(false);
  };

  const shopDefaultValues: DeepPartial<TEditShopFormValues> = {
    displayName: "",
    completeDisplayName: "",
    shortDisplayName: "",
    pumpGroup: "",
    chain: "",
    company: "",
    replicationSite: "",
    shopCode: "",
    adherentCode: "",
    thirdPartyCode: "",
    closingPeriods: [],
    tag: [],
  };

  const { handleSubmit, control, trigger, setValue, formState, reset } =
    useForm<TEditShopFormValues>({
      resolver: zodResolver(editShopFormValuesSchema),
      defaultValues: shopDefaultValues,
    });

  useEffect(() => {
    reset();
  }, [routeObject?.id, reset]);

  useEffect(() => {
    if (shopData) {
      reset(shopData);
    }
  }, [setValue, shopData, reset]);

  const handleFinish = (values: TEditShopFormValues) => {
    if (!routeObject || !tenant) return;
    const onSuccess = () => {
      notify.success({ message: t("shop.success.updatingShop") });
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    reset(values); // clean the "dirty" state
    void dispatch(
      updateShop({
        routeObject,
        values,
        tenantId: tenant.id,
        onSuccess,
        onError,
      }),
    );
  };

  const handleCancel = () => {
    navigate({ route: "" });
  };

  const setLastPumpGroupValueFromPumpGroupList = useCallback(
    (logicalStockGroupList: IHATEOASItem[] | undefined) => {
      if (!logicalStockGroupList || !logicalStockGroupList.length) return;
      const lastPumpGroupValue = last(logicalStockGroupList);
      if (!lastPumpGroupValue || !lastPumpGroupValue.objectId) return;
      setValue("pumpGroup", lastPumpGroupValue.objectId, { shouldDirty: true });
    },
    [setValue],
  );

  const loadPumpGroupHandler = useCallback(() => {
    if (!tenant) return;
    void dispatch(
      loadLogicalStockGroup({
        tenantId: tenant.id,
        onSuccess: setLastPumpGroupValueFromPumpGroupList,
      }),
    );
  }, [dispatch, setLastPumpGroupValueFromPumpGroupList, tenant]);

  const addNewPumpGroupHandler = useCallback(
    (value: string) => {
      if (!tenant || !value) return;
      const onSuccess = () => {
        notify.success({
          message: t("logicalStockGroup.success.creatingLogicalStockGroup"),
        });
        loadPumpGroupHandler();
      };
      const onError = (errorMessage: string) => {
        notify.error({ message: errorMessage });
      };

      void dispatch(
        createLogicalStockGroup({
          displayName: value,
          tenantId: tenant.id,
          onSuccess,
          onError,
        }),
      );
    },
    [dispatch, loadPumpGroupHandler, notify, t, tenant],
  );

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
        shopId: routeObject.id,
        shopName: routeObject.title,
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
      <EditShop
        header={
          <StatusBar
            tenant={tenant}
            replicationSite={replicationSite}
            shop={routeObject}
          />
        }
        control={control}
        trigger={trigger}
        errors={formState.errors}
        history={shopHistory}
        isDirty={formState.isDirty}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        pumpGroupOption={pumpGroupOption}
        chainOption={chainOption}
        companyOption={companyOption}
        replicationSiteOption={replicationSiteOption}
        tagOption={TAG_OPTIONS}
        showPumpGroupModal={showPumpGroupModal}
        disabledFields={{ shopCode: true }}
        onForceSynchronization={debouncedForceSynchronizationHandler}
        onDeleteButton={deleteHandler}
      />
      <NewPumpGroupModalForm
        open={openNewPumpGroupModal}
        onCancel={hidePumpGroupModal}
        addNewPumpGroupHandler={addNewPumpGroupHandler}
      />
    </>
  );
};
