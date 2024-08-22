import {
  ComponentProps,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
import memoize from "lodash/memoize";
import noop from "lodash/noop";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { EMPTY_ARRAY, ObjectForm, THandleSubmit } from "@/common/components";
import { TagSelector, SegmentedField } from "@/common/containers";
import { ISelectOption } from "@/common/types";
import { DeleteButton } from "@/features/deleteButton";
import { HistoryTable, THistoryList } from "@/features/history";

import { TTenantFormValues } from "../../models/tenantForm.ts";

import { useStyles } from "./TenantForm.styles.ts";

interface ITenantFormProps {
  header?: ReactNode;
  isLoading?: boolean;
  skipLoading?: boolean;
  formController: ReturnType<typeof useForm<TTenantFormValues>>;
  title?: string;
  tagOptions?: ISelectOption[];
  showTags?: boolean;
  canEditTemplate?: boolean;
  history?: THistoryList;
  templates?: string[];
  databaseVersions?: string[];
  containerSizes?: string[];
  chainOptions?: ISelectOption[];
  showTechnicalName?: boolean;
  showTenantId?: boolean;
  showTenantSecret?: boolean;
  showHistory?: boolean;
  onFinish: (values: TTenantFormValues) => void;
  onCancel: () => void;
  onForceSynchronization?: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  isObjectCreationInProgress?: boolean;
  onDeleteButton?: () => void;
  disableSubmitIfFormNotDirty?: boolean;
}

type TSelectOptions = ComponentProps<typeof Select<string>>["options"];

const getStringOptions = memoize((strings: string[]) => {
  return strings.map((str) => ({
    label: str,
    value: str,
  }));
});

const useStringOptions = ({
  stringValues,
  resetValue = noop,
}: {
  stringValues: string[];
  resetValue: () => void;
}) => {
  const [options, setOptions] = useState<TSelectOptions>([]);

  useEffect(() => {
    if (!stringValues) return;
    const templateOptions = getStringOptions(stringValues);
    setOptions(templateOptions);
    resetValue();
  }, [resetValue, stringValues]);

  return {
    options,
  };
};

export const TenantForm: FC<ITenantFormProps> = ({
  header,
  isLoading,
  skipLoading,
  formController,
  title,
  tagOptions = EMPTY_ARRAY,
  showTags = true,
  canEditTemplate = true,
  history = EMPTY_ARRAY,
  templates = EMPTY_ARRAY,
  databaseVersions = EMPTY_ARRAY,
  containerSizes = EMPTY_ARRAY,
  chainOptions = EMPTY_ARRAY,
  showTechnicalName = false,
  showTenantId = true,
  showTenantSecret = true,
  showHistory = false,
  onFinish,
  onForceSynchronization,
  onCancel,
  isSubmitting,
  submitButtonText,
  isObjectCreationInProgress = false,
  onDeleteButton,
  disableSubmitIfFormNotDirty = false,
}) => {
  const { t } = useTranslation();

  const { styles, cx } = useStyles();

  const { handleSubmit, control, getValues, setValue, formState } =
    formController;

  const handleFinish = useMemo(
    () =>
      handleSubmit(() => {
        // for some reason the values from arguments don't contain the array fields
        const values = getValues();
        onFinish(values);
      }) as THandleSubmit,
    [getValues, handleSubmit, onFinish],
  );

  const { options: templateOptions } = useStringOptions({
    stringValues: templates,
    resetValue: useCallback(() => {
      setValue("template", "");
    }, [setValue]),
  });

  const { options: databaseVersionOptions } = useStringOptions({
    stringValues: databaseVersions,
    resetValue: useCallback(() => {
      setValue("databaseVersion", undefined);
    }, [setValue]),
  });

  return (
    <ObjectForm
      name="tenant"
      labelCol={{ flex: "180px" }}
      colon={false}
      labelAlign="left"
      isLoading={isLoading}
      skipLoading={skipLoading}
      onSubmitCapture={handleFinish}
      header={header}
      formContent={
        <>
          {title && (
            <Form.Item>
              <Flex justify="center">
                <Typography.Title level={4}>{title}</Typography.Title>
              </Flex>
            </Form.Item>
          )}

          <div className={cx(!showTags && styles.oneColumnWrapper)}>
            <Row justify="space-evenly" gutter={16}>
              <Col flex={1}>
                <FormItem
                  control={control}
                  label={t("tenant.form.displayName")}
                  name="displayName"
                  required
                >
                  <Input disabled={isObjectCreationInProgress} />
                </FormItem>

                <FormItem
                  control={control}
                  label={t("tenant.form.originalName")}
                  name="originalName"
                  required
                >
                  <Input disabled={isObjectCreationInProgress} />
                </FormItem>

                {showTechnicalName && (
                  <FormItem
                    control={control}
                    label={t("tenant.form.technicalName")}
                    name="technicalName"
                  >
                    <Input disabled={isObjectCreationInProgress} />
                  </FormItem>
                )}

                <FormItem
                  control={control}
                  label={t("tenant.form.containerName")}
                  name="containerName"
                  required
                >
                  <Input disabled={isObjectCreationInProgress} />
                </FormItem>

                <Row justify="space-between" gutter={16}>
                  <Col flex="auto">
                    <FormItem
                      control={control}
                      label={t("tenant.form.template")}
                      name="template"
                      required={canEditTemplate}
                    >
                      {canEditTemplate ? (
                        <Select
                          options={templateOptions}
                          allowClear
                          disabled={isObjectCreationInProgress}
                        />
                      ) : (
                        <Input disabled />
                      )}
                    </FormItem>
                  </Col>
                  <Col className={styles.templateVersion}>
                    <FormItem
                      control={control}
                      name="databaseVersion"
                      labelCol={{ flex: "none" }}
                    >
                      {canEditTemplate ? (
                        <Select
                          placeholder={t("tenant.form.databaseVersion")}
                          options={databaseVersionOptions}
                          allowClear
                          disabled={isObjectCreationInProgress}
                        />
                      ) : (
                        <Input disabled />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row justify="space-between" gutter={16}>
                  <Col flex="auto">
                    <FormItem
                      control={control}
                      label={t("tenant.form.containerUrl")}
                      name="containerUrl"
                      required
                    >
                      <Input.TextArea
                        rows={2}
                        disabled={isObjectCreationInProgress}
                      />
                    </FormItem>
                  </Col>
                  <Col>
                    <Form.Item>
                      {/* always disabled for now */}
                      <Button disabled={isObjectCreationInProgress || true}>
                        {t("tenant.form.connect")}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>

                <SegmentedField
                  control={control}
                  name="containerSize"
                  label={t("tenant.form.containerSize")}
                  required={false} // optional for now
                  options={containerSizes}
                  block
                  disabled={isObjectCreationInProgress || true} // always disabled for now
                />

                {showTenantId && (
                  <FormItem
                    control={control}
                    label={t("tenant.form.tenantId")}
                    name="tenantId"
                    required={showTenantId}
                  >
                    <Input />
                  </FormItem>
                )}

                {showTenantSecret && (
                  <FormItem
                    control={control}
                    label={t("tenant.form.tenantSecret")}
                    name="tenantSecret"
                    required={showTenantSecret}
                  >
                    <Input.Password />
                  </FormItem>
                )}

                <FormItem
                  control={control}
                  label={t("tenant.form.chain")}
                  name="chain"
                  required
                >
                  <Select
                    options={chainOptions}
                    disabled={isObjectCreationInProgress}
                  />
                </FormItem>
              </Col>

              {showTags && (
                <Col flex={0}>
                  <Form.Item>
                    <TagSelector
                      control={control}
                      tagOption={tagOptions}
                      errorMessage={formState.errors.tag?.message}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            {showHistory && (
              <Row gutter={16}>
                <Form.Item>
                  <HistoryTable historyList={history} />
                </Form.Item>
              </Row>
            )}
          </div>
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
              {onForceSynchronization && (
                <Button type="primary" onClick={onForceSynchronization}>
                  {t("common.form.buttons.forceSync")}
                </Button>
              )}
              <Button
                loading={isSubmitting}
                disabled={
                  isObjectCreationInProgress ||
                  (disableSubmitIfFormNotDirty && !formState.isDirty)
                }
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
