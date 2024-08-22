import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  finishedIcon: css`
    color: ${token.colorSuccess};
  `,

  errorIcon: css`
    color: ${token.colorError};
  `,

  progressIcon: css`
    color: ${token.colorPrimary};
  `,
}));
