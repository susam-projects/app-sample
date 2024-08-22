import {
  FC,
  ReactEventHandler,
  SyntheticEvent,
  useMemo,
  useState,
} from "react";

import { Button, Flex, Table, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import { ResizeCallbackData } from "react-resizable";

import { IHistoryItem, THistoryList } from "../../models/history";
import { ResizableTitle } from "../ResizableTitle/ResizableTitle";

import { useStyles } from "./HistoryTable.styles";

interface IHistoryTableProps {
  historyList: THistoryList;
  isLoading?: boolean;
  isLoadingMoreData?: boolean;
  loadMoreHistoryData?: () => void;
  title?: string;
}

export const HistoryTable: FC<IHistoryTableProps> = ({
  historyList,
  isLoading,
  isLoadingMoreData,
  loadMoreHistoryData,
  title,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const columnsHeadersData = useMemo(
    () => [
      {
        key: "date",
        title: t("history.headers.date"),
        dataIndex: "date",
        width: 200,
      },
      {
        key: "user",
        title: t("history.headers.user"),
        dataIndex: "user",
        width: 100,
      },
      {
        key: "actionType",
        title: t("history.headers.actionType"),
        dataIndex: "actionType",
        width: 200,
      },
      {
        key: "detail",
        title: t("history.headers.detail"),
        dataIndex: "detail",
        width: 200,
      },
      {
        key: "result",
        title: t("history.headers.result"),
        dataIndex: "result",
        width: 100,
      },
      {
        key: "info",
        title: t("history.headers.info"),
        dataIndex: "info",
        width: 100,
      },
      {
        key: "duration",
        title: t("history.headers.duration"),
        dataIndex: "duration",
        width: 100,
      },
    ],
    [t],
  );

  const [columns, setColumns] =
    useState<TableColumnsType<IHistoryItem>>(columnsHeadersData);

  const handleResize =
    (index: number) =>
    (_: SyntheticEvent, { size }: ResizeCallbackData) => {
      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergedColumns = columns.map<TableColumnsType<IHistoryItem>[number]>(
    (col, index) => ({
      ...col,
      onHeaderCell: (column: TableColumnsType<IHistoryItem>[number]) => ({
        width: column.width,
        onResize: handleResize(index) as ReactEventHandler,
      }),
    }),
  );

  return (
    <div className={styles.tableLayout}>
      <div>
        <Table
          bordered
          components={{
            header: {
              cell: ResizableTitle,
            },
          }}
          columns={mergedColumns}
          dataSource={historyList}
          pagination={false}
          loading={isLoading}
          title={() => title || t("history.history")}
        />
        {loadMoreHistoryData && (
          <Flex justify="end" className={styles.viewMoreMargin}>
            <Button
              onClick={loadMoreHistoryData}
              loading={isLoadingMoreData}
              disabled={isLoading || isLoadingMoreData}
            >
              {t("history.viewMore")}
            </Button>
          </Flex>
        )}
      </div>
    </div>
  );
};
