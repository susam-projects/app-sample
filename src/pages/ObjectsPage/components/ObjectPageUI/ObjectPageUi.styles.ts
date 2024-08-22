import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  searchInput: css`
    width: 350px;
  `,

  tagSelect: css`
    min-width: 150px;
  `,

  userInfoWrapper: css`
    height: 64px;

    cursor: pointer;
  `,
}));
