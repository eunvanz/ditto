import React from "react";
import CriticalConfirmModal from "./CriticalConfirmModal";
import useCriticalConfirmModalProps from "./useCriticalConfirmModalProps";

const CriticalConfirmModalContainer = () => {
  const props = useCriticalConfirmModalProps();

  return <CriticalConfirmModal {...props} />;
};

export default CriticalConfirmModalContainer;
