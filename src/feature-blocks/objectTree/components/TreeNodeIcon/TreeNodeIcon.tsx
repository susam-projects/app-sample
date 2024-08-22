import { FC } from "react";

import { useStyles } from "./TreeNodeIcon.styles.ts";

export const TreeNodeIcon: FC<{ iconUrl: string }> = ({ iconUrl }) => {
  const { styles } = useStyles({ iconUrl });
  return <div className={styles.icon} />;
};
