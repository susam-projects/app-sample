import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  title: css`
    margin-top: 0;
  `,

  inputWrapper: css`
    display: flex;

    width: 250px;
  `,

  inputPrefix: css`
    margin-right: 2px;

    color: ${token.colorIcon};
  `,

  errorText: css`
    text-align: center;
  `,

  loginButton: css`
    width: 100%;
  `,
}));
