import { createStyles } from "antd-style";

export const useStyles = createStyles(
  ({ css }, props: { iconUrl: string }) => ({
    icon: css`
      height: 100%;
      background-image: url(${props.iconUrl});
      background-size: contain;

      transform: scale(1.6, 1.6);
    `,
  }),
);
