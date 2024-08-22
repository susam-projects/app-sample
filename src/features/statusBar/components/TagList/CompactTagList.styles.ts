import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  itemWrapper: css`
    max-width: 50px;
  `,

  showMore: css`
    color: ${token.customBlue};

    cursor: pointer;
    &:hover {
      color: ${token.customBlueMiddle};
    }
  `,
}));
