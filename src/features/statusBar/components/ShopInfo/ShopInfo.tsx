import { FC } from "react";

import { Flex, Space, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { IShopInfo } from "../../types/statusBarInfo.ts";
import { EnabledIndicator } from "../EnabledIndicator/EnabledIndicator.tsx";
import { CompactTagList } from "../TagList/CompactTagList.tsx";
import { TagList } from "../TagList/TagList.tsx";
import { useTagList } from "../TagList/useTagList.ts";

import { useStyles } from "./ShopInfo.styles.ts";

interface IShopInfoProps {
  shop: IShopInfo;
}

export const ShopInfo: FC<IShopInfoProps> = ({ shop }) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const { isCompactTagList, toggleIsCompactTagList } = useTagList();

  return (
    <Flex vertical gap="small">
      <Flex justify="space-between" gap="small">
        <Flex gap="small" align="center" className={styles.titleWrapper}>
          <Tooltip title={shop.name}>
            <Typography.Text strong className={styles.title} ellipsis>
              {shop.name}
            </Typography.Text>
          </Tooltip>
          <EnabledIndicator isEnabled={shop.isEnabled} />
        </Flex>
        {isCompactTagList && (
          <CompactTagList
            tags={shop.tags}
            onShowMoreClick={toggleIsCompactTagList}
          />
        )}
      </Flex>
      {!isCompactTagList && (
        <TagList tags={shop.tags} onHideClick={toggleIsCompactTagList} />
      )}
      <Space size="large">
        <Flex vertical>
          <Typography.Text className={styles.subTitle}>
            {t("statusBar.shop.shopCode")}
          </Typography.Text>
          <Typography.Text className={styles.subTitle}>
            {shop.tiersCode}
          </Typography.Text>
        </Flex>
        <Flex vertical>
          <Typography.Text className={styles.subTitle}>
            {t("statusBar.shop.adhCode")}
          </Typography.Text>
          <Typography.Text className={styles.subTitle}>
            {shop.adhCode}
          </Typography.Text>
        </Flex>
      </Space>
    </Flex>
  );
};
