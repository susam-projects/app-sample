import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  root: css`
    align-items: center;

    min-width: 140px;

    height: 100%;
    padding: 0 8px;
    background-color: ${token.colorPrimary};
  `,
  avatar: css`
    background-color: ${token.customBlue};
  `,
  name: css`
    color: white;
    font-weight: bold;
  `,
}));
