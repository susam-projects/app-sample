import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  reactResizableHandle: css`
    position: absolute;
    z-index: 1;
    right: -5px;
    bottom: 0;

    width: 10px;
    height: 100%;

    cursor: col-resize;
  `,
}));
