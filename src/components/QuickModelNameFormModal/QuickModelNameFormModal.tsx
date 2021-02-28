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
      title={isModification ? "Modify model" : "New model"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <QuickModelNameForm />
    </Modal>
  );
};

export default QuickModelNameFormModal;
