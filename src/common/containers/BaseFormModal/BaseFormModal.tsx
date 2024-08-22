import { FC, PropsWithChildren } from "react";

import { Form, Modal, ModalProps } from "antd";
import { UseFormReset } from "react-hook-form";

import { THandleSubmit } from "@/common/components";

interface ModalFormProps extends ModalProps {
  open: boolean;
  onCancel: () => void;
  modalSubmitHandler: THandleSubmit;
  reset: UseFormReset<any>;
  formName: string;
  modalTitle?: string;
}

export const BaseFormModal: FC<PropsWithChildren<ModalFormProps>> = ({
  open,
  onCancel,
  modalSubmitHandler,
  reset,
  formName,
  modalTitle = "",
  children,
  ...rest
}) => {
  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      onOk={modalSubmitHandler}
      afterClose={reset}
      {...rest}
    >
      <Form name={formName} colon={false} style={{ paddingTop: "40px" }}>
        {children}
      </Form>
    </Modal>
  );
};
