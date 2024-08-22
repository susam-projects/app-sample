import { FC } from "react";

import { Modal, Typography } from "antd";
import { t } from "i18next";

interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
  onDeleteConfirm: () => void;
}

export const DeleteConfirmationModal: FC<ModalFormProps> = ({
  open,
  onCancel,
  onDeleteConfirm,
  ...rest
}) => {
  return (
    <Modal
      title={t("common.confirmDisabling")}
      open={open}
      onCancel={onCancel}
      onOk={onDeleteConfirm}
      cancelText={t("common.form.buttons.cancel")}
      okText={t("common.form.buttons.confirm")}
      centered
      {...rest}
    >
      <Typography.Text>{t("common.onceDisabled")}</Typography.Text>
    </Modal>
  );
};
