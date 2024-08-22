import { ThemeConfig } from "antd";
import { createStyles } from "antd-style";

export const CONTEXT_MENU_PADDING = 8;

export const theme: ThemeConfig = {
  components: {
    Menu: {
      itemHeight: 28,
      itemBorderRadius: 4,
    },
  },
};

export const useStyles = createStyles(({ css }) => ({
  contextMenu: css`
    border-radius: 8px;
  `,
}));
