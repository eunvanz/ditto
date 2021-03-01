import React from "react";
import RequestBodyForm from "./RequestBodyForm";
import useRequestBodyFormProps from "./useRequestBodyFormProps";

const RequestBodyFormContainer = () => {
  const props = useRequestBodyFormProps();
  return <RequestBodyForm {...props} />;
};

export default RequestBodyFormContainer;
