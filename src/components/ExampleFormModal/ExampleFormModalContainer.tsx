import React from "react";
import ExampleFormModal from "./ExampleFormModal";
import useExampleFormModalProps from "./useExampleFormModalProps";

const ExampleFormModalContainer = () => {
  const props = useExampleFormModalProps();
  return <ExampleFormModal {...props} />;
};

export default ExampleFormModalContainer;
