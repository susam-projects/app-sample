import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  shortNameWidth: css`
    width: 65%;
  `,
  adhCode: css`
    width: 35%;
    margin-left: 10px;
  `,
  tiersCodeWidth: css`
    width: 320px;
  `,
  pumpGroupWidth: css`
    width: 100%;
  `,
  plusButton: css`
    margin-left: 5px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background-color: transparent;
    aspect-ratio: 1;
  `,
}));
