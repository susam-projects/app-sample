import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  titleWrapper: css`
    min-width: 0;
  `,

  title: css`
    font-size: 1.2em;
    line-height: 1em;
  `,

  subTitle: css`
    font-size: 0.8em;
  `,
}));
