import React from "react";
import QuickUrlFormModal from "./QuickUrlFormModal";
import useQuickUrlFormModalProps from "./useQuickUrlFormModalProps";

const QuickUrlFormModalContainer = () => {
  const props = useQuickUrlFormModalProps();
  return <QuickUrlFormModal {...props} />;
};

export default QuickUrlFormModalContainer;
