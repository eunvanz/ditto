import React from "react";
import CodeModal from "./CodeModal";
import useCodeModalProps from "./useCodeModalProps";

const CodeModalContainer = () => {
  const props = useCodeModalProps();

  return <CodeModal {...props} />;
};

export default CodeModalContainer;
