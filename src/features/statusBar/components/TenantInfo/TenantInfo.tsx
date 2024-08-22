import { FC } from "react";

import { Flex, Tooltip, Typography } from "antd";
import isNil from "lodash/isNil";
import { useTranslation } from "react-i18next";

import { ITenantInfo } from "../../types/statusBarInfo.ts";
import { EnabledIndicator } from "../EnabledIndicator/EnabledIndicator.tsx";
import { CompactTagList } from "../TagList/CompactTagList.tsx";
import { TagList } from "../TagList/TagList.tsx";
import { useTagList } from "../TagList/useTagList.ts";

import { useStyles } from "./TenantInfo.styles.ts";

const TenantCounter: FC<{ title: string; count: number }> = ({
  title,
  count,
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.counterRoot}>
      <Typography.Text className={styles.countTitle}>{title}</Typography.Text>
      <div className={styles.countWrapper}>
        <Typography.Text strong className={styles.count}>
          {count}
        </Typography.Text>
      </div>
    </div>
  );
};

export const TenantInfo: FC<{ tenant: ITenantInfo }> = ({ tenant }) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const { isCompactTagList, toggleIsCompactTagList } = useTagList();

  return (
    <Flex vertical gap="small">
      <Flex justify="space-between" gap="small">
        <Flex gap="small" align="center" className={styles.tenantNameWrapper}>
          <Tooltip title={tenant.name}>
            <Typography.Text strong className={styles.tenantName} ellipsis>
              {tenant.name}
            </Typography.Text>
          </Tooltip>
          <EnabledIndicator isEnabled={tenant.isEnabled} />
        </Flex>
        {isCompactTagList && (
          <CompactTagList
            tags={tenant.tags}
            onShowMoreClick={toggleIsCompactTagList}
          />
        )}
      </Flex>
      {!isCompactTagList && (
        <TagList tags={tenant.tags} onHideClick={toggleIsCompactTagList} />
      )}
      <Flex gap="middle" wrap="wrap">
        {!isNil(tenant.companiesCount) && (
          <TenantCounter
            title={t("statusBar.tenant.companies")}
            count={tenant.companiesCount}
          />
        )}
        {!isNil(tenant.replicationSitesCount) && (
          <TenantCounter
            title={t("statusBar.tenant.replicationSites")}
            count={tenant.replicationSitesCount}
          />
        )}
        {!isNil(tenant.shopsCount) && (
          <TenantCounter
            title={t("statusBar.tenant.shops")}
            count={tenant.shopsCount}
          />
        )}
        {!isNil(tenant.devicesCount) && (
          <TenantCounter
            title={t("statusBar.tenant.devices")}
            count={tenant.devicesCount}
          />
        )}
      </Flex>
    </Flex>
  );
};
