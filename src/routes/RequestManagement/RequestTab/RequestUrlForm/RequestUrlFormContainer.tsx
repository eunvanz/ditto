import React from "react";
import RequestUrlForm from "./RequestUrlForm";
import useRequestUrlFormProps from "./useRequestUrlFormProps";

const RequestUrlFormContainer = () => {
  const { request, baseUrls, onSubmit } = useRequestUrlFormProps();

  return !!request && !!baseUrls ? (
    <RequestUrlForm request={request} baseUrls={baseUrls} onSubmit={onSubmit} />
  ) : null;
};

export default RequestUrlFormContainer;
