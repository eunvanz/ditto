import React from "react";
import ModelTable, { ModelTableProps } from "./ModelTable";
import useModelTableProps from "./useModelTableProps";

export type ModelTableContainerProps = Omit<
  ModelTableProps,
  | "projectModels"
  | "projectEnumerations"
  | "onSetEditingModelField"
  | "editingModelFieldId"
  | "onClickQuickEditModelName"
  | "onSubmitModelField"
  | "onDeleteModelField"
  | "checkIsSubmittingModelField"
>;

const ModelTableContainer = ({
  model,
  modelFields,
  ...restProps
}: ModelTableContainerProps) => {
  const props = useModelTableProps({ model, modelFields });

  return <ModelTable {...props} {...restProps} />;
};

export default ModelTableContainer;
