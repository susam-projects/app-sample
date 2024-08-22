import { ComponentProps, ForwardedRef, forwardRef } from "react";

import { Switch } from "antd";
import { useTranslation } from "react-i18next";

const EnableSwitchComponent = (
  props: ComponentProps<typeof Switch>,
  ref?: ForwardedRef<HTMLElement>,
) => {
  const { t } = useTranslation();

  return (
    <Switch
      checkedChildren={t("common.form.buttons.on")}
      unCheckedChildren={t("common.form.buttons.off")}
      ref={ref}
      {...props}
    />
  );
};

export const EnableSwitch = forwardRef(EnableSwitchComponent);
