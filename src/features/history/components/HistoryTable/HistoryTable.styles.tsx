import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  tableLayout: css`
    display: flex;

    align-items: center;
    justify-content: center;

    thead > tr > th {
      user-select: none;

      cursor: default;
    }
  `,

  viewMoreMargin: css`
    margin-top: 20px;
  `,
}));
