import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  flex: css`
    display: flex;
  `,

  divider: css`
    height: 2em;
  `,

  loadMoreButton: css`
    padding-left: 0;
  `,
}));
