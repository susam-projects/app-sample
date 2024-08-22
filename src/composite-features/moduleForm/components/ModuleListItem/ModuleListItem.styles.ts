import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  rowWidth: css`
    max-width: 35rem;
  `,
  rowPadding: css`
    padding: 10px 0;
  `,
  spanName: css`
    user-select: none;

    cursor: pointer;
  `,
  checkboxMargin: css`
    margin-right: 10px;
  `,
  removeMargin: css`
    margin: 0;
  `,
}));
