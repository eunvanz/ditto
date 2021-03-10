import React from "react";
import NotFoundView from "../NotFound";
import RequestManagementView from "./RequestManagementView";
import useRequestManagementViewProps from "./useRequestManagementViewProps";

const RequestManagementViewContainer = () => {
  const {
    request,
    key,
    isNotExist,
    ...restProps
  } = useRequestManagementViewProps();

  return request ? (
    <RequestManagementView request={request} key={key} {...restProps} />
  ) : isNotExist ? (
    <NotFoundView
      title="The operation you are looking for isn't here"
      description="The operation doesn't exist or might be deleted."
    />
  ) : null;
};

export default RequestManagementViewContainer;
