import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  disabled: css`
    color: ${token.customGreyNeutral};
  `,
}));
