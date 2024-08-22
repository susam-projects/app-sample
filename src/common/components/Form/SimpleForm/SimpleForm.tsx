import { FC, ReactNode } from "react";

import { useStyles } from "./SimpleForm.styles.ts";

interface IFormWrapperProps {
  children: ReactNode;
}

export const SimpleForm: FC<IFormWrapperProps> = ({ children }) => {
  const { styles } = useStyles();
  return <section className={styles.root}>{children}</section>;
};
