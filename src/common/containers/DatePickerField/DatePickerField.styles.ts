import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  errorMessage: css`
    color: ${token.colorError};
  `,
  datePickerWithNoYear: css`
    .ant-picker-header > button.ant-picker-header-super-prev-btn,
    button.ant-picker-header-super-next-btn,
    button.ant-picker-year-btn {
      display: none !important;
    }
  `,
}));
