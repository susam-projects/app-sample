import { FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Input } from "antd";
import { DeepPartial, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useTranslation } from "react-i18next";

import { THandleSubmit } from "@/common/components";
import { BaseFormModal } from "@/common/containers";

import {
  TNewPumoGroupFormValues,
  newPumoGroupFormValuesSchema,
} from "../models/shop";

interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
  addNewPumpGroupHandler: (value: string) => void;
}

export const NewPumpGroupModalForm: FC<ModalFormProps> = ({
  open,
  onCancel,
  addNewPumpGroupHandler,
}) => {
  const { t } = useTranslation();

  const newPumpGroupDefaultValue: DeepPartial<TNewPumoGroupFormValues> = {
    newPumpGroup: "",
  };

  const { control, handleSubmit, reset } = useForm<TNewPumoGroupFormValues>({
    resolver: zodResolver(newPumoGroupFormValuesSchema),
    defaultValues: newPumpGroupDefaultValue,
  });

  const handleFinish = (value: TNewPumoGroupFormValues) => {
    void addNewPumpGroupHandler(value.newPumpGroup);
    onCancel();
  };

  return (
    <BaseFormModal
      open={open}
      onCancel={onCancel}
      reset={reset}
      modalSubmitHandler={handleSubmit(handleFinish) as THandleSubmit}
      formName="new-pump-group"
      centered
      okText={t("common.form.buttons.add")}
      cancelText={t("common.form.buttons.cancel")}
    >
      <Flex>
        <FormItem
          control={control}
          label={t("shop.form.newPumpGroupName")}
          name="newPumpGroup"
          required
          style={{ width: "100%" }}
        >
          <Input autoFocus />
        </FormItem>
      </Flex>
    </BaseFormModal>
  );
};
