import { EMPTY_TABLE_ITEM, HISTORY_DATE_FORMAT } from "@/common/constants";
import { formatDate } from "@/common/utils/dateUtils.ts";
import { THistoryList } from "@/features/history";

import { IHATEOASItem } from "../api";
import { ISelectOption } from "../types";

export const mapIHATEOASItemsToSelectOptions = (
  objects?: IHATEOASItem[],
): ISelectOption[] => {
  return (objects || []).map((item) => ({
    value: item.objectId || "",
    label: item.displayName || "",
  }));
};

export const getHistoryItemsFromIHATEOASItem = (
  object: IHATEOASItem,
): THistoryList => {
  return (object.historicalActions || []).map((historyAction, i) => ({
    key: `${historyAction.date}-${i}`, // TODO: think about some kind of id
    date:
      formatDate({
        inputDate: historyAction.date,
        outputFormat: HISTORY_DATE_FORMAT,
        outputTimezone: "Local",
      }) || EMPTY_TABLE_ITEM,
    user: historyAction.user || EMPTY_TABLE_ITEM,
    actionType: historyAction.historicalActionType || EMPTY_TABLE_ITEM,
    detail: historyAction.detail || EMPTY_TABLE_ITEM,
    result: "" || EMPTY_TABLE_ITEM,
    info: "" || EMPTY_TABLE_ITEM,
    duration: "" || EMPTY_TABLE_ITEM,
  }));
};
