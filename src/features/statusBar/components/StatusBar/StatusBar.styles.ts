import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => {
  return {
    wrapper: css`
      border-bottom: 1px solid ${token.colorBorder};
    `,

    resizeHandle: css`
      position: absolute;
      z-index: 1;
      right: -5px;
      bottom: 0;

      width: 10px;
      height: 100%;

      cursor: col-resize;
    `,

    resizeContentWrapper: css`
      position: relative;
    `,

    tenantInfo: css`
      flex: 0 1 0;

      min-width: 350px;
      padding: 8px 16px;

      white-space: nowrap;
    `,

    replicationSite: css`
      flex: 0 1 0;

      min-width: 100px;
      padding: 8px;
      border-left: 1px solid ${token.colorBorder};
    `,

    shopInfo: css`
      flex: 0 1 0;

      min-width: 350px;
      padding: 8px;
      border-left: 1px solid ${token.colorBorder};

      white-space: nowrap;
    `,
  };
});
