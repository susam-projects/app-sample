import { FC } from "react";

import { Space, Tooltip, Typography } from "antd";
import noop from "lodash/noop";
import { useTranslation } from "react-i18next";

import { useStyles } from "./CompactTagList.styles.ts";

interface ICompactTagListProps {
  tags: string[];
  onShowMoreClick?: () => void;
}
export const CompactTagList: FC<ICompactTagListProps> = ({
  tags,
  onShowMoreClick = noop,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const tagsToShow = tags.slice(0, 2);
  const isShowEverything = tags.length === tagsToShow.length;

  return (
    <Space>
      <Space split="-">
        {tagsToShow.map((tag) => (
          <div className={styles.itemWrapper} key={tag}>
            <Tooltip title={tag}>
              <Typography.Text italic ellipsis>
                {tag}
              </Typography.Text>
            </Tooltip>
          </div>
        ))}
      </Space>
      {!isShowEverything && (
        <Typography.Text
          className={styles.showMore}
          underline
          onClick={onShowMoreClick}
        >
          {t("statusBar.tags.showMore")}
        </Typography.Text>
      )}
    </Space>
  );
};
