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
  useRouteObjectSiblings,
} from "@/feature-blocks/objectTree";

import { CreateShop } from "../components/CreateShop/CreateShop";
import {
  TCreateShopFormValues,
  createShopFormValuesSchema,
} from "../models/shop";
import {
  selectChain,
  selectStoreSign,
  loadAddShopData,
  createShop,
  selectIsLoading,
  selectIsSubmitting,
  selectPumpGroup,
  createLogicalStockGroup,
  loadLogicalStockGroup,
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

export const CreateShopForm: FC = () => {
  const [notify, notificationContext] = notification.useNotification();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const pumpGroupOption = useAppSelector(selectPumpGroup);
  const chainOption = useAppSelector(selectChain);
  const storeSignOption = useAppSelector(selectStoreSign);
  const navigate = useObjectsNavigate();
  const [open, setOpen] = useState(false);
  const routeObject = useRouteObject();
  const { siblings: replicationSites } = useRouteObjectSiblings({
    type: ObjectType.ReplicationSite,
  });
  const { siblings: companies } = useRouteObjectSiblings({
    type: ObjectType.Company,
  });
  const replicationSiteOption =
    Objects.storeNodeToSelectOptions(replicationSites);
  const companyOption = Objects.storeNodeToSelectOptions(companies);
  const tenant = useRouteObjectAncestor({ type: ObjectType.Tenant });

  useEffect(() => {
    const loadData = debounce(
      () => {
        if (tenant?.id) {
          const onError = (errorMessage: string) => {
            notify.error({ message: errorMessage });
          };
          void dispatch(loadAddShopData({ tenantId: tenant.id, onError }));
        }
      },
      300,
      { leading: false, trailing: true },
    );
    void loadData();

    return () => {
      loadData.cancel();
    };
  }, [dispatch, notify, tenant?.id]);

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
    (() => {
      if (routeObject?.type === ObjectType.Company) {
        setValue("company", routeObject.id);
        setValue("replicationSite", replicationSiteOption[0]?.value || "");
      }
      if (routeObject?.type === ObjectType.ReplicationSite) {
        setValue("replicationSite", routeObject.id);
        setValue("company", companyOption[0]?.value || "");
      }
    })();
  }, [
    companyOption,
    replicationSiteOption,
    routeObject?.id,
    routeObject?.title,
    routeObject?.type,
    setValue,
  ]);

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
