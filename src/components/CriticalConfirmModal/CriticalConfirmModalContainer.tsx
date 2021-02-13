import React from "react";
import CriticalConfirmModal, {
  CriticalConfirmModalFormValues,
} from "./CriticalConfirmModal";
import useCriticalConfirmModalProps from "./useCriticalConfirmModalProps";

export interface CriticalConfirmModalContainerProps {
  onSubmit: (values: CriticalConfirmModalFormValues) => void;
}

const CriticalConfirmModalContainer = ({
  onSubmit,
}: CriticalConfirmModalContainerProps) => {
  const props = useCriticalConfirmModalProps({ onSubmit });

  return <CriticalConfirmModal {...props} />;
};

export default CriticalConfirmModalContainer;
