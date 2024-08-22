import {
  ComponentProps,
  FC,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Flex } from "antd";
import { Resizable } from "react-resizable";

import { IStoreDataNode } from "@/feature-blocks/objectTree";

import {
  getReplicationSiteInfo,
  getShopInfo,
  getTenantInfo,
} from "../../services/statusBar.service.ts";
import { ReplicationSiteInfo } from "../ReplicationSiteInfo/ReplicationSiteInfo.tsx";
import { ShopInfo } from "../ShopInfo/ShopInfo.tsx";
import { TenantInfo } from "../TenantInfo/TenantInfo.tsx";

import { useStyles } from "./StatusBar.styles.ts";

interface IStatusBarUIProps {
  tenant?: IStoreDataNode;
  replicationSite?: IStoreDataNode;
  shop?: IStoreDataNode;
  isHidden?: boolean;
}

type TOnResize = NonNullable<ComponentProps<typeof Resizable>["onResize"]>;

const ResizableColumn: FC<{
  className: string;
  shouldResize: boolean;
  children: ReactNode;
}> = ({ className, shouldResize, children }) => {
  const { styles, cx } = useStyles();

  const [width, setWidth] = useState(500);

  const handleResize = useCallback<TOnResize>((_, { size }) => {
    setWidth(size.width);
  }, []);

  return (
    <Resizable
      axis="x"
      width={width}
      handle={shouldResize ? <span className={styles.resizeHandle} /> : null}
      onResize={handleResize}
    >
      <div
        className={cx(styles.resizeContentWrapper, className)}
        style={{ flexGrow: width }}
      >
        {children}
      </div>
    </Resizable>
  );
};

export const StatusBar: FC<IStatusBarUIProps> = ({
  tenant,
  replicationSite,
  shop,
  isHidden = true,
}) => {
  const { styles } = useStyles();

  const tenantInfo = useMemo(() => getTenantInfo(tenant), [tenant]);
  const replicationSiteInfo = useMemo(
    () => getReplicationSiteInfo(replicationSite),
    [replicationSite],
  );
  const shopInfo = useMemo(() => getShopInfo(shop), [shop]);

  if (isHidden) {
    return null;
  }

  return (
    <Flex
      /* the key makes columns reset their sizes when the data is changed */
      key={`${tenantInfo?.id}-${replicationSiteInfo?.id}-${shopInfo?.id}`}
      className={styles.wrapper}
    >
      {tenantInfo && (
        <ResizableColumn
          className={styles.tenantInfo}
          shouldResize={!!replicationSiteInfo || !!shopInfo}
        >
          <TenantInfo tenant={tenantInfo} />
        </ResizableColumn>
      )}
      {replicationSiteInfo && (
        <ResizableColumn
          className={styles.replicationSite}
          shouldResize={!!shopInfo}
        >
          <ReplicationSiteInfo replicationSite={replicationSiteInfo} />
        </ResizableColumn>
      )}
      {shopInfo && (
        <ResizableColumn className={styles.shopInfo} shouldResize={false}>
          <ShopInfo shop={shopInfo} />
        </ResizableColumn>
      )}
    </Flex>
  );
};
