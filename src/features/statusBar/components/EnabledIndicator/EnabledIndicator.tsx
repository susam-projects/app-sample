import { FC } from "react";

import { Typography } from "antd";
import { useTranslation } from "react-i18next";

interface IEnabledIndicatorProps {
  isEnabled: boolean;
}

export const EnabledIndicator: FC<IEnabledIndicatorProps> = ({ isEnabled }) => {
  const { t } = useTranslation();

  return isEnabled ? (
    <Typography.Text type="success" strong>
      - {t("statusBar.common.open")}
    </Typography.Text>
  ) : (
    <Typography.Text type="danger" strong>
      - {t("statusBar.common.closed")}
    </Typography.Text>
  );
};
