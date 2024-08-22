import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  typographyHeader: css`
    margin-bottom: 35px;

    font-size: large;
    font-weight: bold;
  `,
  rowMarginTop: css`
    margin-top: 70px;
  `,
  flexMarginTop: css`
    margin-top: 35px;
  `,
  divPadding: css`
    padding-right: 100px;
  `,
  checkboxMargin: css`
    margin-right: 10px;
  `,
}));
