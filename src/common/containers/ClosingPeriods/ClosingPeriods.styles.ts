import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  removePeriodIcon: css`
    color: ${token.colorIcon};
    &:hover {
      color: ${token.colorError};
    }
  `,

  addPeriodPicker: css`
    border-style: dashed;
  `,

  errorBorder: css`
    border: 1px solid ${token.colorError};
    border-radius: ${token.borderRadius}px;
  `,
}));
