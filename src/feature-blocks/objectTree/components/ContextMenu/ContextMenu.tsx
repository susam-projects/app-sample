import { ComponentProps, FC } from "react";

import { FloatingPortal } from "@floating-ui/react";
import { ConfigProvider, Menu } from "antd";

import { theme, useStyles } from "./ContextMenu.styles.ts";
import { useContextMenu } from "./useContextMenu.ts";

interface IContextMenuProps {
  controller: ReturnType<typeof useContextMenu>;
  items: ComponentProps<typeof Menu>["items"];
  onSelect: ComponentProps<typeof Menu>["onSelect"];
}

export const ContextMenu: FC<IContextMenuProps> = ({
  controller,
  items,
  onSelect,
}) => {
  const { _isOpen, _refs, _floatingStyles, _getFloatingProps } = controller;

  const { styles } = useStyles();

  return (
    <ConfigProvider theme={theme}>
      <FloatingPortal>
        {_isOpen && (
          <div
            ref={_refs.setFloating}
            style={{ ..._floatingStyles }}
            {..._getFloatingProps()}
          >
            <Menu
              mode="vertical"
              items={items}
              className={styles.contextMenu}
              onSelect={onSelect}
            />
          </div>
        )}
      </FloatingPortal>
    </ConfigProvider>
  );
};
