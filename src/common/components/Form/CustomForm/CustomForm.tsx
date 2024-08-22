import { FC, ReactNode } from "react";

import { useStyles } from "./CustomForm.styles.ts";

interface IFormWrapperProps {
  children: ReactNode;
}

export const CustomForm: FC<IFormWrapperProps> = ({ children }) => {
  const { styles } = useStyles();
  return <section className={styles.root}>{children}</section>;
};
