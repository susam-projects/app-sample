import { useState } from "react";

export const useMoveModal = ({ onOk }: { onOk: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    onOk();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return {
    show: showModal,
    _isModalOpen: isModalOpen,
    _handleModalOk: handleModalOk,
    _handleModalCancel: handleModalCancel,
  };
};
