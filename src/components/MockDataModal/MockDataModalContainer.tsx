import React from "react";
import MockDataModal from "./MockDataModal";
import useMockDataModalProps from "./useMockDataModalProps";

const MockDataModalContainer = () => {
  const props = useMockDataModalProps();

  return <MockDataModal {...props} />;
};

export default MockDataModalContainer;
