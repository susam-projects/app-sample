import { FC, ReactNode } from "react";

import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import noop from "lodash/noop";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { ObjectForm } from "@/common/components";
import { ClosingPeriods, TagSelector } from "@/common/containers";
import { ISelectOption } from "@/common/types";
import { DeleteButton } from "@/features/deleteButton";
import { HistoryTable, THistoryList } from "@/features/history";

import { TEditShopFormValues } from "../../models/shop";

import { PumpGroupSelect } from "./PumpGroupSelect";

interface IEditShopProps {
  header?: ReactNode;
  control: ReturnType<typeof useForm<TEditShopFormValues>>["control"];
  trigger: ReturnType<typeof useForm<TEditShopFormValues>>["trigger"];
  errors: ReturnType<
    typeof useForm<TEditShopFormValues>
  >["formState"]["errors"];
  history: THistoryList;
  isDirty: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  onFinish: () => void;
  onCancel: () => void;
  pumpGroupOption: ISelectOption[];
  chainOption: ISelectOption[];
  companyOption: ISelectOption[];
  replicationSiteOption: ISelectOption[];
  tagOption: ISelectOption[];
  showPumpGroupModal: () => void;
  showHistory?: boolean;
  disabledFields?: {
    shopCode?: boolean;
  };
  onForceSynchronization?: () => void;
  onDeleteButton?: () => void;
}

export const EditShop: FC<IEditShopProps> = ({
  header,
  control,
  trigger,
  errors,
  history,
  isDirty,
  isLoading,
  isSubmitting,
  onFinish,
  onCancel,
  pumpGroupOption,
  chainOption,
  companyOption,
  replicationSiteOption,
  tagOption,
  showPumpGroupModal,
  showHistory = false,
  disabledFields = {},
  onForceSynchronization,
  onDeleteButton,
}) => {
  const { t } = useTranslation();

  return (
    <ObjectForm
      name="edit-shop"
      labelCol={{ flex: "200px" }}
      colon={false}
      labelAlign="left"
      isLoading={isLoading}
      onSubmitCapture={onFinish}
      wrapperCol={{ span: 11 }}
      header={header}
      formContent={
        <div>
          <Row justify="space-evenly" gutter={16}>
            <Col span={10}>
              <FormItem
                control={control}
                label={t("shop.form.shopName")}
                name="displayName"
                required
              >
                <Input />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.completeDisplayName")}
                name="completeDisplayName"
                required
              >
                <Input />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.shortDisplayName")}
                name="shortDisplayName"
                required
              >
                <Input />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.pumpGroup")}
                name="pumpGroup"
                required
              >
                <PumpGroupSelect
                  pumpGroupOption={pumpGroupOption}
                  onPlusClick={showPumpGroupModal}
                />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.chainType")}
                name="chain"
                required
              >
                <Select size="middle" options={chainOption} />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.company")}
                name="company"
                required
              >
                <Select size="middle" options={companyOption} />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.replicationSite")}
                name="replicationSite"
                required
              >
                <Select size="middle" options={replicationSiteOption} />
              </FormItem>
              <ClosingPeriods
                label={t("shop.form.closingPeriod")}
                control={control}
                trigger={trigger}
                errorMessage={errors.closingPeriods?.message}
              />
            </Col>

            <Col span={7}>
              <FormItem
                control={control}
                label={t("shop.form.shopCode")}
                name="shopCode"
                labelCol={{ flex: "100px" }}
              >
                <Input disabled={!!disabledFields.shopCode} />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.adhCode")}
                name="adherentCode"
                required
                labelCol={{ flex: "100px" }}
              >
                <Input />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.tiersCode")}
                name="thirdPartyCode"
                required
                labelCol={{ flex: "100px" }}
              >
                <Input />
              </FormItem>
            </Col>

            <Col span={7} flex="auto">
              <TagSelector<TEditShopFormValues>
                control={control}
                tagOption={tagOption}
                onReInit={noop}
                errorMessage={errors.tag?.message}
              />
            </Col>
          </Row>

          {showHistory && (
            <Row gutter={16}>
              <Form.Item wrapperCol={{ span: "" }}>
                <HistoryTable historyList={history} />
              </Form.Item>
            </Row>
          )}
        </div>
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
                disabled={!isDirty}
                type="primary"
                htmlType="submit"
              >
                {t("common.form.buttons.save")}
              </Button>
            </Space>
          </Col>
        </Row>
      }
    />
  );
};
