import React from "react";
import { ProjectDoc } from "../../../types";
import EnumForm from "./EnumForm";
import useEnumFormProps from "./useEnumFormProps";

export interface EnumFormContainerProps {
  project: ProjectDoc;
}

const EnumFormContainer = ({ project }: EnumFormContainerProps) => {
  const props = useEnumFormProps({ project });

  return <EnumForm {...props} />;
};

export default EnumFormContainer;
