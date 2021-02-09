import React from "react";
import EnumForm from "./EnumForm";
import useEnumFormProps from "./useEnumFormProps";

const EnumFormContainer = () => {
  const props = useEnumFormProps();

  return props.enumerations ? <EnumForm {...props} /> : null;
};

export default EnumFormContainer;
