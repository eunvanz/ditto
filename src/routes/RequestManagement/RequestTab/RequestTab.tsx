import React from "react";
import RequestParamForm from "../../../components/RequestParamForm";
import { REQUEST_PARAM_LOCATION } from "../../../types";

export interface RequestTabProps {}

const RequestTab: React.FC<RequestTabProps> = ({}) => {
  return (
    <>
      <RequestParamForm location={REQUEST_PARAM_LOCATION.PATH} />
    </>
  );
};

export default RequestTab;
