import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  error: css`
    border: 1px solid ${token.colorError};
  `,
}));
