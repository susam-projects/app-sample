import { createStyles } from "antd-style";

const DRAG_HANDLE_WIDTH = 5;

export const useStyles = createStyles(({ css, token }) => ({
  layout: css`
    height: 100vh;
  `,

  header: css`
    z-index: 10;
    display: flex;

    align-items: center;
    justify-content: space-between;

    padding: 0 0 0 16px;
    border-bottom: 1px solid ${token.colorBorder};
    background-color: unset;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 0 5px 0,
      rgba(0, 0, 0, 0.1) 0 0 1px 0;

    line-height: unset;
  `,

  content: css`
    display: flex;
    overflow: auto;

    flex-direction: column;

    height: 100%;
  `,

  sider: css`
    && {
      border-right: 1px solid lightgrey;
      background-color: unset;

      transition: none;
    }
  `,

  siderInner: css`
    overflow-y: auto;

    height: 100%;
  `,

  siderDragHandle: css`
    position: absolute;
    z-index: 1000;
    top: 0;
    right: -${Math.ceil(DRAG_HANDLE_WIDTH / 2)}px;
    bottom: 0;

    width: ${DRAG_HANDLE_WIDTH}px;

    transition: all 250ms ease-in-out;

    cursor: col-resize;

    &:hover {
      background: ${token.customGreyNeutral};
    }
  `,
}));
