import { FC } from "react";

import { PlusOutlined } from "@ant-design/icons";
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

import { ObjectForm } from "@/common/components";
import { ISelectOption } from "@/common/types";

import { TCreateShopFormValues } from "../../models/shop";

import { useStyles } from "./CreateShop.styles";

interface ICreateShopProps {
  control: ReturnType<typeof useForm<TCreateShopFormValues>>["control"];
  isLoading: boolean;
  isSubmitting: boolean;
  onFinish: () => void;
  onCancel: () => void;
  pumpGroupOption: ISelectOption[];
  chainOption: ISelectOption[];
  companyOption: ISelectOption[];
  storeSignOption: ISelectOption[];
  replicationSiteOption: ISelectOption[];
  showPumpGroupModal: () => void;
  isObjectCreationInProgress: boolean;
  disabledFields?: {
    displayName?: boolean;
    completeDisplayName?: boolean;
    shortDisplayName?: boolean;
    adherentCode?: boolean;
    pumpGroup?: boolean;
    chain?: boolean;
    thirdPartyCode?: boolean;
    storeSign?: boolean;
    company?: boolean;
    replicationSite?: boolean;
  };
}

export const CreateShop: FC<ICreateShopProps> = ({
  control,
  isLoading,
  isSubmitting,
  onFinish,
  onCancel,
  pumpGroupOption,
  chainOption,
  companyOption,
  storeSignOption,
  replicationSiteOption,
  showPumpGroupModal,
  isObjectCreationInProgress,
  disabledFields = {},
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <ObjectForm
      name="create-shop"
      labelCol={{ flex: "200px" }}
      colon={false}
      labelAlign="left"
      isLoading={isLoading}
      onSubmitCapture={onFinish}
      formContent={
        <>
          <Form.Item>
            <Flex justify="center">
              <Typography.Title level={4}>
                {t("shop.form.addNewShop")}
              </Typography.Title>
            </Flex>
          </Form.Item>
          <Row justify="space-between" gutter={16}>
            <Col flex="auto" span={12}>
              <FormItem
                control={control}
                label={t("shop.form.shopName")}
                name="displayName"
                required
              >
                <Input
                  disabled={
                    !!disabledFields.displayName || isObjectCreationInProgress
                  }
                />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.completeDisplayName")}
                name="completeDisplayName"
                required
              >
                <Input
                  disabled={
                    !!disabledFields.completeDisplayName ||
                    isObjectCreationInProgress
                  }
                />
              </FormItem>
              <Flex justify="center">
                <FormItem
                  control={control}
                  label={t("shop.form.shortDisplayName")}
                  name="shortDisplayName"
                  required
                  className={styles.shortNameWidth}
                >
                  <Input
                    disabled={
                      !!disabledFields.shortDisplayName ||
                      isObjectCreationInProgress
                    }
                  />
                </FormItem>
                <FormItem
                  control={control}
                  label={t("shop.form.adhCode")}
                  name="adherentCode"
                  required
                  labelCol={{ flex: "90px" }}
                  className={styles.adhCode}
                >
                  <Input
                    disabled={
                      !!disabledFields.adherentCode ||
                      isObjectCreationInProgress
                    }
                  />
                </FormItem>
              </Flex>
            </Col>
            <Col span={12}>
              <Row gutter={16}>
                <Col span={19}>
                  <Typography>
                    {t("shop.form.nameGenerate", {
                      name: "Chullanka Antibes XXX",
                    })}
                  </Typography>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify="space-between" gutter={16}>
            <Col flex="auto" span={12}>
              <Flex>
                <FormItem
                  control={control}
                  label={t("shop.form.pumpGroup")}
                  name="pumpGroup"
                  required
                  className={styles.pumpGroupWidth}
                >
                  <Select
                    size="middle"
                    options={pumpGroupOption}
                    disabled={
                      !!disabledFields.pumpGroup || isObjectCreationInProgress
                    }
                  />
                </FormItem>
                <Button
                  className={styles.plusButton}
                  onClick={showPumpGroupModal}
                  disabled={
                    !!disabledFields.pumpGroup || isObjectCreationInProgress
                  }
                >
                  <PlusOutlined />
                </Button>
              </Flex>
              <FormItem
                control={control}
                label={t("shop.form.chain")}
                name="chain"
                required
              >
                <Select
                  size="middle"
                  options={chainOption}
                  disabled={
                    !!disabledFields.chain || isObjectCreationInProgress
                  }
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                control={control}
                label={t("shop.form.tiersCode")}
                name="thirdPartyCode"
                required
                labelCol={{ flex: "120px" }}
                className={styles.tiersCodeWidth}
              >
                <Input
                  disabled={
                    !!disabledFields.thirdPartyCode ||
                    isObjectCreationInProgress
                  }
                />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.shopSign")}
                name="storeSign"
                required
                labelCol={{ flex: "120px" }}
              >
                <Select
                  size="middle"
                  style={{ width: 200 }}
                  options={storeSignOption}
                  disabled={
                    !!disabledFields.storeSign || isObjectCreationInProgress
                  }
                />
              </FormItem>
            </Col>
          </Row>
          <Row justify="space-between" gutter={16}>
            <Col flex="auto" span={12}>
              <FormItem
                control={control}
                label={t("shop.form.company")}
                name="company"
                required
              >
                <Select
                  size="middle"
                  options={companyOption}
                  disabled={
                    !!disabledFields.company || isObjectCreationInProgress
                  }
                />
              </FormItem>
              <FormItem
                control={control}
                label={t("shop.form.replicationSite")}
                name="replicationSite"
                required
              >
                <Select
                  size="middle"
                  options={replicationSiteOption}
                  disabled={
                    !!disabledFields.replicationSite ||
                    isObjectCreationInProgress
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </>
      }
      footer={
        <Row justify="end">
          <Col>
            <Space>
              <Button onClick={onCancel}>
                {t("common.form.buttons.cancel")}
              </Button>
              <Button
                loading={isSubmitting}
                disabled={isObjectCreationInProgress}
                type="primary"
                htmlType="submit"
              >
                {t("common.form.buttons.create")}
              </Button>
            </Space>
          </Col>
        </Row>
      }
    />
  );
};
