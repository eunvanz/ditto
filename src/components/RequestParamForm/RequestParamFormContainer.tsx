import React from "react";
import { REQUEST_PARAM_LOCATION } from "../../types";
import RequestParamForm from "./RequestParamForm";
import useRequestParamFormProps from "./useRequestParamFormProps";

export interface RequestParamFormContainerProps {
  location: REQUEST_PARAM_LOCATION;
}

const RequestParamFormContainer = ({
  location,
}: RequestParamFormContainerProps) => {
  const props = useRequestParamFormProps({ location });
  return <RequestParamForm {...props} />;
};

export default RequestParamFormContainer;
