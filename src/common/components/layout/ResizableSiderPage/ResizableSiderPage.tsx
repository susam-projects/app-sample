import { FC, MouseEventHandler, ReactNode, useState } from "react";

import { Layout } from "antd";

import { useOnMount } from "@/common/hooks";
import { ls } from "@/common/localStorageClient";

import { useStyles } from "./ResizableSiderPage.styles.ts";

const { Header, Sider, Content } = Layout;

interface IResizableSiderPage {
  name?: string;
  minSiderWidth?: number;
  maxSiderWidth?: number;
  defaultSiderWidth?: number;
  header: ReactNode | ReactNode[];
  sider: ReactNode | ReactNode[];
  content: ReactNode | ReactNode[];
}

const getLocalStorageKey = (pageName: string) => {
  return `${pageName}_sider`;
};

const getValueWithConstraint = (
  width: number,
  { min = -Infinity, max = Infinity }: { min?: number; max?: number },
) => {
  return Math.min(max, Math.max(min, width));
};

export const ResizableSiderPage: FC<IResizableSiderPage> = ({
  name = "resizable-sider-page",
  minSiderWidth = 300,
  maxSiderWidth = 700,
  defaultSiderWidth = 350,
  header,
  sider,
  content,
}) => {
  const { styles } = useStyles();

  const [siderWidth, setSiderWidth] = useState(defaultSiderWidth);

  useOnMount(() => {
    const storedWidth = ls.get(getLocalStorageKey(name)) || "";
    const parsedWidth = Number.parseInt(storedWidth, 10) || defaultSiderWidth;
    setSiderWidth(parsedWidth);
  });

  const handleDragHandleMouseDown: MouseEventHandler<HTMLDivElement> = () => {
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();

      const siderWidth = getValueWithConstraint(event.clientX, {
        min: minSiderWidth,
        max: maxSiderWidth,
      });
      ls.set(getLocalStorageKey(name), String(siderWidth));
      setSiderWidth(siderWidth);
    };

    const clearListeners = () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseup", clearListeners);
      document.body.removeEventListener("mouseleave", clearListeners);
    };

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", clearListeners);
    document.body.addEventListener("mouseleave", clearListeners);
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>{header}</Header>
      <Layout>
        <Sider width={siderWidth} className={styles.sider}>
          <div className={styles.siderInner}>{sider}</div>
          <div
            className={styles.siderDragHandle}
            onMouseDown={handleDragHandleMouseDown}
          />
        </Sider>
        <Content className={styles.content}>{content}</Content>
      </Layout>
    </Layout>
  );
};
