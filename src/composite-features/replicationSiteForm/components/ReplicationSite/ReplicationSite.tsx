import { FC, ReactNode } from "react";

import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  Space,
  Flex,
  Typography,
  Layout,
} from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { ObjectForm } from "@/common/components";
import { ISelectOption } from "@/common/types";
import { DeleteButton } from "@/features/deleteButton";
import { siteTypesOptions } from "@/features/replicationSite";

import { TReplicationSiteFormValues } from "../../models/replicationSite";

import { useStyles } from "./ReplicationSite.styles";

interface IReplicationSiteProps {
  header?: ReactNode;
  isDirty: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  mainShopOption: Array<ISelectOption>;
  control: ReturnType<typeof useForm<TReplicationSiteFormValues>>["control"];
  onFinish: () => void;
  onCancel: () => void;
  rangeFieldValue: string;
  title?: string;
  submitButtonText: string;
  isObjectCreationInProgress?: boolean;
  disabledFields?: {
    thirdPartyCode?: boolean;
    guId?: boolean;
    baseId?: boolean;
    genVersion?: boolean;
    siteType?: boolean;
    sender?: boolean;
    versionIdStart?: boolean;
    versionIdEnd?: boolean;
  };
  showGUID?: boolean;
  showGenVersion?: boolean;
  onForceSynchronization?: () => void;
  onDeleteButton?: () => void;
  disableSubmitIfFormNotDirty?: boolean;
}

export const ReplicationSite: FC<IReplicationSiteProps> = ({
  header,
  isDirty,
  isLoading,
  isSubmitting,
  mainShopOption,
  control,
  onFinish,
  onCancel,
  rangeFieldValue,
  title,
  submitButtonText,
  isObjectCreationInProgress = false,
  disabledFields = {},
  showGUID = true,
  showGenVersion = false,
  onForceSynchronization,
  onDeleteButton,
  disableSubmitIfFormNotDirty = false,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <ObjectForm
      name="replication-site"
      labelCol={{ flex: "190px" }}
      colon={false}
      labelAlign="left"
      onSubmitCapture={onFinish}
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
          <Layout className={styles.layout}>
            <Row gutter={15}>
              <Col span={16}>
                <FormItem
                  control={control}
                  label={t("replicationSite.form.replicationSiteName")}
                  name="displayName"
                  required
                >
                  <Input disabled={isObjectCreationInProgress} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  control={control}
                  label={t("replicationSite.form.codeTiers")}
                  name="thirdPartyCode"
                  required
                  labelCol={{ flex: "100px" }}
                >
                  <Input
                    disabled={
                      !!disabledFields.thirdPartyCode ||
                      isObjectCreationInProgress
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            {showGUID && (
              <FormItem
                control={control}
                label={t("replicationSite.form.guId")}
                name="guId"
                required
              >
                <Input
                  disabled={!!disabledFields.guId || isObjectCreationInProgress}
                />
              </FormItem>
            )}
            <Row gutter={15}>
              <Col span={12}>
                <FormItem
                  control={control}
                  label={t("replicationSite.form.baseId")}
                  name="baseId"
                  required
                >
                  <Input
                    disabled={
                      !!disabledFields.baseId || isObjectCreationInProgress
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                {showGenVersion && (
                  <FormItem
                    control={control}
                    label={t("replicationSite.form.genVersion")}
                    name="genVersion"
                    labelCol={{ flex: "110px" }}
                    required
                  >
                    <Input
                      disabled={
                        !!disabledFields.genVersion ||
                        isObjectCreationInProgress
                      }
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row gutter={15}>
              <Col span={12}>
                <FormItem
                  control={control}
                  label={t("replicationSite.form.siteType")}
                  name="siteType"
                  required
                >
                  <Select
                    options={siteTypesOptions}
                    disabled={
                      !!disabledFields.siteType || isObjectCreationInProgress
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  control={control}
                  label={t("replicationSite.form.sender")}
                  name="sender"
                  required
                  labelCol={{ flex: "110px" }}
                >
                  <Input
                    disabled={
                      !!disabledFields.sender || isObjectCreationInProgress
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Flex gap="large">
              <FormItem
                control={control}
                label={t("replicationSite.form.rangeStart")}
                name="startReplicationRange"
                required
                labelCol={{ flex: "130px" }}
              >
                <Input disabled={isObjectCreationInProgress} />
              </FormItem>
              <FormItem
                control={control}
                label={t("replicationSite.form.finish")}
                name="endReplicationRange"
                required
                labelCol={{ flex: "60px" }}
              >
                <Input disabled={isObjectCreationInProgress} />
              </FormItem>
              <Input
                value={rangeFieldValue}
                disabled
                size="small"
                className={styles.customInput}
              />
              <Button disabled>{t("replicationSite.form.checkRange")}</Button>
            </Flex>
            <Flex gap="large">
              <FormItem
                control={control}
                label={t("replicationSite.form.versionIdStart")}
                name="versionIdStart"
                required
                labelCol={{ flex: "130px" }}
                className={styles.startRangeInputWidth}
              >
                <Input
                  disabled={
                    !!disabledFields.versionIdStart ||
                    isObjectCreationInProgress
                  }
                />
              </FormItem>
              <FormItem
                control={control}
                label={t("replicationSite.form.finish")}
                name="versionIdEnd"
                required
                labelCol={{ flex: "60px" }}
                className={styles.endRangeInputWidth}
              >
                <Input
                  disabled={
                    !!disabledFields.versionIdEnd || isObjectCreationInProgress
                  }
                />
              </FormItem>
            </Flex>
            <FormItem
              control={control}
              label={t("replicationSite.form.token")}
              name="maxToken"
              required
              labelCol={{ flex: "130px" }}
              className={styles.widthInputWidth}
            >
              <Input disabled={isObjectCreationInProgress} />
            </FormItem>
            <FormItem
              control={control}
              label={t("replicationSite.form.mainShop")}
              name="mainShop"
              required
              labelCol={{ flex: "130px" }}
              className={styles.selectWidth}
            >
              <Select
                size="middle"
                options={mainShopOption}
                disabled={isObjectCreationInProgress}
              />
            </FormItem>
          </Layout>
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
                  (disableSubmitIfFormNotDirty && !isDirty)
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
