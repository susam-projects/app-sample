import { FC } from "react";

import { Button, Col, Flex, Form, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { CustomForm } from "@/common/components";

import { useStyles } from "./ModuleCopyConfiguration.styles.ts";

interface IModuleCopyConfigurationProps {
  tenantName: string;
  modulesCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export const ModuleCopyConfiguration: FC<IModuleCopyConfigurationProps> = ({
  tenantName,
  modulesCount,
  onCancel,
  onConfirm,
  isSubmitting,
  isSubmitted,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <CustomForm>
      <Flex justify="center">
        <Typography className={styles.typographyHeader}>
          {t("module.copyModuleConfig", { tenantName, count: modulesCount })}
        </Typography>
      </Flex>
      <Flex justify="center">
        <Typography>
          {t("module.doYouConfirm", { tenantName, count: modulesCount })}
        </Typography>
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
                onClick={onConfirm}
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
