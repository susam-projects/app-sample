import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  tenantNameWrapper: css`
    min-width: 0;
  `,

  tenantName: css`
    font-size: 1.2em;
    line-height: 1em;
  `,

  countWrapper: css`
    text-align: center;
  `,

  counterRoot: css`
    line-height: 1em;
  `,

  countTitle: css`
    font-size: 0.8em;
  `,

  count: css`
    font-size: 0.9em;
    line-height: 0.9em;
  `,
}));
