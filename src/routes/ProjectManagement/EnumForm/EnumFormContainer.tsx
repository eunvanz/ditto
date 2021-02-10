import React from "react";
import EnumForm from "./EnumForm";
import useEnumFormProps from "./useEnumFormProps";

const EnumFormContainer = () => {
  const props = useEnumFormProps();

  return <EnumForm {...props} />;
};

export default EnumFormContainer;
