import React from "react";
import Modal from "../Modal";
import QuickEnumForm from "../QuickEnumForm";

export interface QuickEnumFormModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const QuickEnumFormModal: React.FC<QuickEnumFormModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal title="새로운 열거형" isVisible={isVisible} onClose={onClose}>
      <QuickEnumForm />
    </Modal>
  );
};

export default QuickEnumFormModal;
