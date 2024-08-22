import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  tagWrapper: css`
    display: flex;

    height: 100%;
  `,

  tagLabel: css`
    padding: 6px 11px;
    border: solid ${token.colorBorder} 1px;
    border-radius: 5px;
  `,

  removeTagIcon: css`
    &:hover {
      color: ${token.colorError};
    }
  `,

  errorBorder: css`
    border: 1px solid ${token.colorError};
    border-radius: ${token.borderRadius}px;
  `,

  select: css`
    && {
      width: 200px;
    }
  `,

  reInitButton: css`
    margin-bottom: 2rem;
  `,
}));
