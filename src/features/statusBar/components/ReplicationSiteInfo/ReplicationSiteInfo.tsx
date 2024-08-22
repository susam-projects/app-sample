import { FC } from "react";

import { Flex, Space, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { IReplicationSiteInfo } from "../../types/statusBarInfo.ts";

import { useStyles } from "./ReplicationSiteInfo.styles.ts";

interface IReplicationSiteInfoProps {
  replicationSite: IReplicationSiteInfo;
}

export const ReplicationSiteInfo: FC<IReplicationSiteInfoProps> = ({
  replicationSite,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <Flex vertical gap="small">
      <Tooltip title={replicationSite.name}>
        <Typography.Text strong className={styles.title} ellipsis>
          {replicationSite.name}
        </Typography.Text>
      </Tooltip>
      <Space size="middle" wrap>
        <Flex vertical>
          <Typography.Text className={styles.subTitle}>
            {t("statusBar.replicationSite.tiersCode")}
          </Typography.Text>
          <Typography.Text className={styles.subTitle}>
            {replicationSite.tierCode}
          </Typography.Text>
        </Flex>
        <Flex vertical>
          <Typography.Text className={styles.subTitle}>
            {t("statusBar.replicationSite.genVersion")}
          </Typography.Text>
          <Typography.Text className={styles.subTitle}>
            {replicationSite.genVersion}
          </Typography.Text>
        </Flex>
      </Space>
    </Flex>
  );
};
