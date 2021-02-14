import React from "react";
import RequestFormModal from "./RequestFormModal";
import useRequestFormModalProps from "./useRequestFormModalProps";

const RequestFormModalContainer = () => {
  const props = useRequestFormModalProps();

  return <RequestFormModal {...props} />;
};

export default RequestFormModalContainer;
