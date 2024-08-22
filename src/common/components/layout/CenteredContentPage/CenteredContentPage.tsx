import { FC, ReactNode } from "react";

import { Layout } from "antd";

import { useStyles } from "./CenteredContentPage.styles.ts";

interface ICenteredContentPage {
  children: ReactNode | ReactNode[];
}

export const CenteredContentPage: FC<ICenteredContentPage> = ({ children }) => {
  const { styles } = useStyles();

  return <Layout.Content className={styles.wrapper}>{children}</Layout.Content>;
};
