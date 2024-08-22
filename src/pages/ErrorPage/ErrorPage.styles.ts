import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  errorPage: css`
    display: flex;

    align-items: center;
    flex-direction: column;
    justify-content: center;

    width: 100%;
    height: 100vh;
  `,
}));
