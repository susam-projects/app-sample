import { FC } from "react";

import { Flex, Typography } from "antd";

import { TreeNodeIcon } from "../../components/TreeNodeIcon/TreeNodeIcon.tsx";
import { Objects } from "../../mappers/objectTree.mappers.tsx";
import { IStoreDataNode } from "../../types/objectTreeTypes.ts";

import { useStyles } from "./ObjectInfoLine.styles.ts";

interface IObjectInfoLineProps {
  object: IStoreDataNode | null;
}

export const ObjectInfoLine: FC<IObjectInfoLineProps> = ({ object }) => {
  const { styles } = useStyles();

  return (
    <Flex align="center">
      <div className={styles.iconWrapper}>
        <TreeNodeIcon iconUrl={Objects.getObjectIconUrl(object)} />
      </div>
      <Typography.Text type="secondary">{object?.title || ""}</Typography.Text>
    </Flex>
  );
};
