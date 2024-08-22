import { FC, useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { t } from "i18next";
import debounce from "lodash/debounce";
import last from "lodash/last";
import { DeepPartial, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { IHATEOASItem } from "@/common/api";
import { THandleSubmit } from "@/common/components";
import { useObjectCreationInProgress } from "@/common/hooks";
import {
  Objects,
  ObjectType,
  useObjectsNavigate,
  useRouteObject,
  useRouteObjectAncestor,
  useRouteObjectParent,
  useRouteObjectSiblingsByAncestor,
} from "@/feature-blocks/objectTree";

import { CreateShop } from "../components/CreateShop/CreateShop";
import {
  createShopFormValuesSchema,
  TCreateShopFormValues,
} from "../models/shop";
import {
  createLogicalStockGroup,
  createShop,
  loadDuplicateShopData,
  loadLogicalStockGroup,
  selectChain,
  selectIsLoading,
  selectIsSubmitting,
  selectPumpGroup,
  selectShopData,
  selectStoreSign,
} from "../store/shop.slice";

import { NewPumpGroupModalForm } from "./NewPumpGroupModalForm";

const shopDefaultValues: DeepPartial<TCreateShopFormValues> = {
  displayName: "",
  completeDisplayName: "",
  shortDisplayName: "",
  pumpGroup: "",
  chain: "",
  storeSign: "",
  adherentCode: "",
  thirdPartyCode: "",
  replicationSite: "",
  company: "",
};

export const DuplicateShopForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const pumpGroupOption = useAppSelector(selectPumpGroup);
  const chainOption = useAppSelector(selectChain);
  const storeSignOption = useAppSelector(selectStoreSign);
  const shopData = useAppSelector(selectShopData);
  const navigate = useObjectsNavigate();
  const [open, setOpen] = useState(false);
  const routeObject = useRouteObject();
  const parent = useRouteObjectParent();
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
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });

  useEffect(() => {
    const loadData = debounce(
      () => {
        if (routeObject && tenant) {
          const onError = (errorMessage: string) => {
            notify.error({ message: errorMessage });
          };
          void dispatch(
            loadDuplicateShopData({
              routeObject,
              tenant,
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
  }, [dispatch, notify, routeObject, tenant]);

  const showPumpGroupModal = () => {
    setOpen(true);
  };

  const hidePumpGroupModal = () => {
    setOpen(false);
  };

  const { handleSubmit, control, setValue, reset } =
    useForm<TCreateShopFormValues>({
      resolver: zodResolver(createShopFormValuesSchema),
      defaultValues: shopDefaultValues,
    });

  useEffect(() => {
    reset();
  }, [routeObject?.id, reset]);

  useEffect(() => {
    if (parent?.type === ObjectType.Company) {
      setValue("company", parent.id);
      setValue("replicationSite", replicationSiteOption[0]?.value || "");
    }
    if (parent?.type === ObjectType.ReplicationSite) {
      setValue("replicationSite", parent.id);
      setValue("company", companyOption[0]?.value || "");
    }
  }, [
    companyOption,
    replicationSiteOption,
    parent?.id,
    parent?.title,
    parent?.type,
    setValue,
  ]);

  useEffect(() => {
    if (shopData) {
      reset(shopData);
    }
  }, [setValue, shopData, reset]);

  const { isObjectCreationInProgress, objectCreationStart } =
    useObjectCreationInProgress({ notify });

  const handleFinish = (values: TCreateShopFormValues) => {
    if (!routeObject || !tenant) return;
    const onSuccess = () => {
      objectCreationStart();
    };
    const onError = (errorMessage: string) => {
      notify.error({ message: errorMessage });
    };
    void dispatch(
      createShop({ values, tenantId: tenant.id, onSuccess, onError }),
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
      setValue("pumpGroup", lastPumpGroupValue.objectId);
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
    [dispatch, loadPumpGroupHandler, notify, tenant],
  );

  return (
    <>
      {notificationContext}
      <CreateShop
        control={control}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onFinish={handleSubmit(handleFinish) as THandleSubmit}
        onCancel={handleCancel}
        pumpGroupOption={pumpGroupOption}
        chainOption={chainOption}
        companyOption={companyOption}
        replicationSiteOption={replicationSiteOption}
        storeSignOption={storeSignOption}
        showPumpGroupModal={showPumpGroupModal}
        isObjectCreationInProgress={isObjectCreationInProgress}
        disabledFields={{
          replicationSite:
            routeObject?.type === ObjectType.ReplicationSite ||
            replicationSiteOption.length < 2,
          company:
            routeObject?.type === ObjectType.Company ||
            companyOption.length < 2,
        }}
      />
      <NewPumpGroupModalForm
        open={open}
        onCancel={hidePumpGroupModal}
        addNewPumpGroupHandler={addNewPumpGroupHandler}
      />
    </>
  );
};
