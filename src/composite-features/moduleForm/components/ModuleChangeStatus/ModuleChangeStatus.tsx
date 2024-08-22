import { FC, useCallback, useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Row,
  Space,
  Typography,
} from "antd";
import noop from "lodash/noop";
import { useTranslation } from "react-i18next";

import { CustomForm } from "@/common/components";

import { useStyles } from "./ModuleChangeStatus.styles.ts";

interface IModuleChangeStatusProps {
  defaultValue?: boolean;
  onChange: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
  onSubmit?: (isModuleEnabled: boolean) => void;
}

export const ModuleChangeStatus: FC<IModuleChangeStatusProps> = ({
  defaultValue,
  onChange,
  onCancel = noop,
  isSubmitting,
  isSubmitted,
  onSubmit = noop,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const [isModuleEnabled, setIsModuleEnabled] = useState(true);

  useEffect(() => {
    setIsModuleEnabled(!!defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    onChange();
    // only if the state is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModuleEnabled]);

  const handleSubmitClick = useCallback(() => {
    onSubmit(isModuleEnabled);
  }, [isModuleEnabled, onSubmit]);

  return (
    <CustomForm>
      <Flex justify="center">
        <Typography className={styles.typographyHeader}>
          {t("module.changeStatus")}
        </Typography>
      </Flex>
      <Flex justify="center">
        <div className={styles.divPadding}>
          <Checkbox
            checked={isModuleEnabled}
            onChange={() => setIsModuleEnabled(true)}
            className={styles.checkboxMargin}
          />
          {t("module.enabledToDisabled")}
        </div>
        <div>
          <Checkbox
            checked={!isModuleEnabled}
            onChange={() => setIsModuleEnabled(false)}
            className={styles.checkboxMargin}
          />
          {t("module.disabledToEnabled")}
        </div>
      </Flex>
      <Flex justify="center" className={styles.flexMarginTop}>
        <Typography>{t("module.confStatusChangeModuleSelect")}</Typography>
      </Flex>
      <Row justify="end" className={styles.rowMarginTop}>
        <Col>
          <Form.Item>
            <Space>
              <Button onClick={onCancel}>
                {t("common.form.buttons.cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmitClick}
                loading={isSubmitting}
                disabled={isSubmitted}
              >
                {t("common.form.buttons.confirm")}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </CustomForm>
  );
};
