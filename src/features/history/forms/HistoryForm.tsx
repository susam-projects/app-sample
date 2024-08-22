import { FC, useCallback } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { SimpleForm } from "@/common/components";
import { useOnMount } from "@/common/hooks";
import { useRouteObject } from "@/feature-blocks/objectTree";

import { HistoryTable } from "../components/HistoryTable/HistoryTable";
import {
  loadHistoryListData,
  loadMoreHistoryListData,
  selectHistoryListData,
  selectIsLoading,
  selectIsLoadingMoreData,
} from "../store/history.slice";

export const HistoryForm: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const historyListData = useAppSelector(selectHistoryListData);
  const isLoading = useAppSelector(selectIsLoading);
  const isLoadingMoreData = useAppSelector(selectIsLoadingMoreData);
  const object = useRouteObject();

  useOnMount(() => {
    void (async () => {
      await dispatch(loadHistoryListData());
    })();
  });

  const loadMoreHistoryData = useCallback(() => {
    void (async () => {
      await dispatch(loadMoreHistoryListData());
    })();
  }, [dispatch]);

  return (
    <SimpleForm>
      <HistoryTable
        title={t("history.historyOf", { objectName: object?.title || "" })}
        historyList={historyListData}
        isLoading={isLoading}
        isLoadingMoreData={isLoadingMoreData}
        loadMoreHistoryData={loadMoreHistoryData}
      />
    </SimpleForm>
  );
};
