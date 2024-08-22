import { FC, ReactNode } from "react";

import { Button, Col, Row, Space, Spin, Typography } from "antd";
import { FieldArrayWithId, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ObjectForm } from "@/common/components";

import { ModuleListItem } from "../../components/ModuleListItem/ModuleListItem.tsx";
import { TModuleListFormValues } from "../../models/formSchema.ts";

import { useStyles } from "./ModuleList.styles.tsx";

interface IModuleListProps {
  isLoading: boolean;
  isSubmitting: boolean;
  header?: ReactNode;
  control: ReturnType<typeof useForm<TModuleListFormValues>>["control"];
  onFinish: () => void;
  onCancel: () => void;
  submitButtonText: string;
  shopName: string;
  modules: FieldArrayWithId<TModuleListFormValues>[];
  setValue: ReturnType<typeof useForm<TModuleListFormValues>>["setValue"];
  selectedModuleId?: string;
}

export const ModuleList: FC<IModuleListProps> = ({
  isLoading,
  isSubmitting,
  header,
  control,
  onFinish,
  onCancel,
  submitButtonText,
  shopName,
  modules,
  setValue,
  selectedModuleId,
}) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <ObjectForm
      name="module-list"
      onSubmitCapture={onFinish}
      header={header}
      formContent={
        <>
          <Typography className={styles.typographyMargin}>
            {t("module.moduleList", { shopName })}
          </Typography>
          {isLoading && <Spin />}
          {modules.map((module, index) => (
            <ModuleListItem
              key={module.id}
              id={module.moduleId}
              name={module.name}
              index={index}
              control={control}
              setValue={setValue}
              selectedModuleId={selectedModuleId}
            />
          ))}
        </>
      }
      footer={
        <Row justify="end">
          <Col>
            <Space>
              <Button onClick={onCancel}>
                {t("common.form.buttons.cancel")}
              </Button>
              <Button loading={isSubmitting} type="primary" htmlType="submit">
                {submitButtonText}
              </Button>
            </Space>
          </Col>
        </Row>
      }
    />
  );
};
