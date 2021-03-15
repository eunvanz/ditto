import React from "react";
import EnumForm from "./EnumForm";
import useEnumFormProps from "./useEnumFormProps";
import { ProjectDoc } from "../../../types";

export interface EnumFormContainerProps {
  project: ProjectDoc;
}

const EnumFormContainer = ({ project }: EnumFormContainerProps) => {
  const props = useEnumFormProps({ project });

  return <EnumForm {...props} />;
};

export default EnumFormContainer;
