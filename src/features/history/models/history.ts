export interface IHistoryItem {
  key: string;
  date: string;
  user: string;
  actionType: string;
  detail: string;
  result: string;
  info: string;
  duration: string;
}

export type THistoryList = Array<IHistoryItem>;

export interface IColumn {
  key: string;
  title: string;
  dataIndex: string;
  width: number;
}
