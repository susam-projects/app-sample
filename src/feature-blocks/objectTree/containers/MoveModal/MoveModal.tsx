import { FC } from "react";

import { Modal, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/app/store";

import { ObjectInfoLine } from "../../components/ObjectInfoLine/ObjectInfoLine.tsx";
import {
  selectMovingObjects,
  selectMovingTarget,
} from "../../store/objectTree.slice.ts";

import { useMoveModal } from "./useMoveModal.ts";

interface IMoveModalProps {
  controller: ReturnType<typeof useMoveModal>;
}

export const MoveModal: FC<IMoveModalProps> = ({ controller }) => {
  const { t } = useTranslation();
  const movingObjects = useAppSelector(selectMovingObjects);
  const movingTarget = useAppSelector(selectMovingTarget);

  return (
    <Modal
      title={t("objectTree.moveModal.title")}
      open={controller._isModalOpen}
      onOk={controller._handleModalOk}
      onCancel={controller._handleModalCancel}
      style={{ zIndex: 9000 }}
    >
      <Typography.Paragraph>
        {t("objectTree.moveModal.descriptionP1")}
        {movingObjects.map((object) => (
          <ObjectInfoLine key={object.id} object={object} />
        ))}
      </Typography.Paragraph>

      <Typography.Paragraph>
        {t("objectTree.moveModal.descriptionP2")}
        <ObjectInfoLine object={movingTarget} />
      </Typography.Paragraph>

      <Typography.Paragraph>
        {t("objectTree.moveModal.descriptionP3")}
      </Typography.Paragraph>
    </Modal>
  );
};
