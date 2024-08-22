import { FC, ReactNode } from "react";

import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { EMPTY_ARRAY, ObjectForm } from "@/common/components";
import { ISelectOption } from "@/common/types";
import { DeleteButton } from "@/features/deleteButton";
import { HistoryTable, THistoryList } from "@/features/history";

import { TDeviceFormValues } from "../../models/deviceForm.ts";

import { useStyles } from "./DeviceFormUI.styles.ts";

interface IDeviceFormUIProps {
  header?: ReactNode;
  title?: string;
  control: ReturnType<typeof useForm<TDeviceFormValues>>["control"];
  history?: THistoryList;
  deviceTypeOptions: ISelectOption[];
  isLoading: boolean;
  isSubmitting: boolean;
  shouldShowHistory?: boolean;
  shouldDisableAll?: boolean;
  shouldDisableSubmit?: boolean;
  onFinish: () => void;
  onCancel: () => void;
  displayNameLabel: string;
  submitButtonText: string;
  onDeleteButton?: () => void;
}

export const DeviceFormUI: FC<IDeviceFormUIProps> = ({
  header,
  title,
  control,
  history = EMPTY_ARRAY,
  deviceTypeOptions,
  isLoading = false,
  isSubmitting = false,
  shouldShowHistory = false,
  shouldDisableAll = false,
  shouldDisableSubmit = false,
  onFinish,
  onCancel,
  displayNameLabel,
  submitButtonText,
  onDeleteButton,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <ObjectForm
      name="device"
      onSubmitCapture={onFinish}
      labelAlign="left"
      labelCol={{ flex: "150px" }}
      header={header}
      isLoading={isLoading}
      formContent={
        <>
          {title && (
            <Form.Item>
              <Flex justify="center">
                <Typography.Title level={4}>{title}</Typography.Title>
              </Flex>
            </Form.Item>
          )}
          <Row gutter={16} className={styles.rowMaxWidth}>
            <Col span={12}>
              <FormItem
                control={control}
                label={t("device.form.deviceType")}
                name="deviceType"
                required
              >
                <Select
                  size="middle"
                  options={deviceTypeOptions}
                  disabled={shouldDisableAll}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                control={control}
                label={t("device.form.deviceNumber")}
                name="deviceNumber"
              >
                <Input disabled />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} className={styles.rowMaxWidth}>
            <Col span={12}>
              <FormItem
                control={control}
                label={displayNameLabel}
                name="displayName"
                required
              >
                <Input disabled={shouldDisableAll} />
              </FormItem>
            </Col>
          </Row>
          {shouldShowHistory && (
            <Row gutter={16}>
              <Form.Item>
                <HistoryTable historyList={history} />
              </Form.Item>
            </Row>
          )}
        </>
      }
      footer={
        <Row justify="end">
          <Col>
            <Space>
              {onDeleteButton && (
                <DeleteButton onDeleteConfirm={onDeleteButton} />
              )}
              <Button onClick={onCancel}>
                {t("common.form.buttons.cancel")}
              </Button>
              <Button
                loading={isSubmitting}
                disabled={shouldDisableAll || shouldDisableSubmit}
                type="primary"
                htmlType="submit"
              >
                {submitButtonText}
              </Button>
            </Space>
          </Col>
        </Row>
      }
    />
  );
};
