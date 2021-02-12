import React from "react";
import Modal from "../Modal";
import QuickModelNameForm from "../QuickModelNameForm";

export interface QuickModelNameFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  isModification: boolean;
}

const QuickModelNameFormModal: React.FC<QuickModelNameFormModalProps> = ({
  isVisible,
  onClose,
  isModification,
}) => {
  return (
    <Modal
      title={isModification ? "모델명 수정" : "새로운 모델"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <QuickModelNameForm />
    </Modal>
  );
};

export default QuickModelNameFormModal;
