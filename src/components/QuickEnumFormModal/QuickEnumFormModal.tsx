import React from "react";
import { EnumerationDoc } from "../../types";
import Modal from "../Modal";
import QuickEnumForm from "../QuickEnumForm";

export interface QuickEnumFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  enumeration?: EnumerationDoc;
}

const QuickEnumFormModal: React.FC<QuickEnumFormModalProps> = ({
  isVisible,
  onClose,
  enumeration,
}) => {
  return (
    <Modal
      title={enumeration ? "Modify enumeration" : "Create new enumeration"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <QuickEnumForm />
    </Modal>
  );
};

export default QuickEnumFormModal;
