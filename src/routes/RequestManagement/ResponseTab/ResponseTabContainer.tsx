import React from "react";
import ResponseTab from "./ResponseTab";
import useResponseTabProps from "./useResponseTabProps";

const ResponseTabContainer = () => {
  const { responseStatuses, ...restProps } = useResponseTabProps();
  return responseStatuses ? (
    <ResponseTab {...restProps} responseStatuses={responseStatuses} />
  ) : null;
};

export default ResponseTabContainer;
