import { useState } from "react";

import { Button } from "antd";
import { t } from "i18next";

import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface DeleteButtonProps {
  onDeleteConfirm: () => void;
}

export const DeleteButton = ({ onDeleteConfirm }: DeleteButtonProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const openDeleteModalHandler = () => {
    setOpenDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setOpenDeleteModal(false);
  };

  const deleteConfirmHandler = () => {
    closeDeleteModalHandler();
    onDeleteConfirm();
  };

  return (
    <>
      <Button type="primary" danger onClick={openDeleteModalHandler}>
        {t("common.form.buttons.delete")}
      </Button>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onCancel={closeDeleteModalHandler}
        onDeleteConfirm={deleteConfirmHandler}
      />
    </>
  );
};
