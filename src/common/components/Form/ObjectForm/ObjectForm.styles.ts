import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  loadingRoot: css`
    display: flex;

    align-items: center;
    justify-content: center;

    height: 100%;
  `,

  loadingFillerText: css`
    visibility: hidden;
  `,

  root: css`
    display: flex;

    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;

    height: 100%;
  `,

  contentRoot: css`
    overflow: auto;
  `,

  content: css`
    max-width: 1200px;
    padding: 24px 24px 0;
  `,

  footer: css`
    padding: 24px;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 0 5px 0,
      rgba(0, 0, 0, 0.1) 0 0 1px 0;
  `,
}));
