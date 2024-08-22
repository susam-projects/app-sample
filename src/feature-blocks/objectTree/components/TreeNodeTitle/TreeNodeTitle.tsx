import { FC } from "react";

import { Typography } from "antd";

import { IUiDataNode } from "@/feature-blocks/objectTree";

import { useStyles } from "./TreeNodeTitle.styles.ts";

interface ITreeNodeTitleProps {
  data: IUiDataNode;
}

export const TreeNodeTitle: FC<ITreeNodeTitleProps> = ({ data }) => {
  const { styles, cx } = useStyles();

  return (
    <Typography.Text className={cx({ [styles.disabled]: data.isDisabled })}>
      {data.title}
    </Typography.Text>
  );
};
