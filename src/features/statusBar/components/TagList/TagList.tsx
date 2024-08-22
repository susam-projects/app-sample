import { FC, Fragment } from "react";

import { Space, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { useStyles } from "./TagList.styles.ts";

interface ITagListProps {
  tags: string[];
  onHideClick?: () => void;
}
export const TagList: FC<ITagListProps> = ({ tags, onHideClick }) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <Space wrap classNames={{ item: styles.wrapperItem }}>
      {tags.map((tag, i) => (
        <Fragment key={tag}>
          {i > 0 && <div>-</div>}
          <Tooltip title={tag}>
            <Typography.Text italic ellipsis>
              {tag}
            </Typography.Text>
          </Tooltip>
        </Fragment>
      ))}
      <Typography.Text
        underline
        className={styles.collapse}
        onClick={onHideClick}
      >
        {t("statusBar.tags.hide")}
      </Typography.Text>
    </Space>
  );
};
