import React from "react";
import OasTab from "./OasTab";
import useOasTabProps from "./useOasTabProps";

const OasTabContainer = () => {
  const props = useOasTabProps();

  return <OasTab {...props} />;
};

export default OasTabContainer;
