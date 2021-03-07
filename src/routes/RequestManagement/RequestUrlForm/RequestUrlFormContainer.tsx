import React from "react";
import RequestUrlForm from "./RequestUrlForm";
import useRequestUrlFormProps from "./useRequestUrlFormProps";

const RequestUrlFormContainer = () => {
  const {
    request,
    baseUrls,
    onSubmit,
    key,
    requests,
  } = useRequestUrlFormProps();

  return !!request && !!baseUrls ? (
    <RequestUrlForm
      request={request}
      baseUrls={baseUrls}
      onSubmit={onSubmit}
      key={key}
      requests={requests}
    />
  ) : null;
};

export default RequestUrlFormContainer;
