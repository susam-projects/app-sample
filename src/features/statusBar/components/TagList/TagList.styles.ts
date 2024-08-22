import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  wrapperItem: css`
    min-width: 0;
  `,

  collapse: css`
    color: ${token.customBlue};

    cursor: pointer;
    &:hover {
      color: ${token.customBlueMiddle};
    }
  `,
}));
