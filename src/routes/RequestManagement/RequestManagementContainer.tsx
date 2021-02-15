import React from "react";
import RequestManagementView from "./RequestManagementView";
import useRequestManagementViewProps from "./useRequestManagementViewProps";

const RequestManagementViewContainer = () => {
  const { request, key } = useRequestManagementViewProps();

  return request ? <RequestManagementView request={request} key={key} /> : null;
};

export default RequestManagementViewContainer;
