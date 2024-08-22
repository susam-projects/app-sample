import { FC, ReactNode } from "react";

import { Button, Col, Flex, Form, Input, Row, Space, Typography } from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { EMPTY_ARRAY, ObjectForm } from "@/common/components";
import { DAY_MONTH_DATE_FORMAT } from "@/common/constants";
import { DatePickerField } from "@/common/containers";
import { DeleteButton } from "@/features/deleteButton";
import { HistoryTable, THistoryList } from "@/features/history";

import { TCompanyFormValues } from "../../models/companyForm.ts";

import { useStyles } from "./Company.styles.ts";

interface IEditCompanyProps {
  header?: ReactNode;
  title?: string;
  control: ReturnType<typeof useForm<TCompanyFormValues>>["control"];
  history?: THistoryList;
  isLoading?: boolean;
  shouldShowHistory?: boolean;
  shouldDisableAll?: boolean;
  shouldDisableSubmit?: boolean;
  isSubmitting: boolean;
  submitButtonText: string;
  onFinish: () => void;
  onCancel: () => void;
  onDeleteButton?: () => void;
}

export const Company: FC<IEditCompanyProps> = ({
  header,
  title,
  control,
  history = EMPTY_ARRAY,
  isLoading,
  shouldShowHistory = false,
  shouldDisableAll = false,
  shouldDisableSubmit = false,
  isSubmitting,
  submitButtonText,
  onFinish,
  onCancel,
  onDeleteButton,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <ObjectForm
      name="company"
      onSubmitCapture={onFinish}
      labelAlign="left"
      labelCol={{ flex: "200px" }}
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
                label={t("company.form.companyName")}
                name="companyName"
                required
              >
                <Input disabled={shouldDisableAll} />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} className={styles.rowMaxWidth}>
            <Col span={12}>
              <Form.Item label={t("company.form.finYearEndDate")} required>
                <DatePickerField
                  control={control}
                  name="finYearEndDate"
                  dateFormat={DAY_MONTH_DATE_FORMAT}
                  width="100%"
                  noYear
                  disabled={shouldDisableAll}
                />
              </Form.Item>
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
