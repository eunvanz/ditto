import React from "react";
import ModelList from "./ModelList";
import ModelForm from "../../../components/ModelForm";
import useModelListProps from "./useModelListProps";
import { ProjectDoc } from "../../../types";

export interface ModelListContainerProps {
  project: ProjectDoc;
}

const ModelListContainer = ({ project }: ModelListContainerProps) => {
  const {
    models,
    onDelete,
    onClickName,
    onClickAdd,
    isVisible,
    onClose,
    defaultModelId,
    role,
  } = useModelListProps({ project });

  return (
    <>
      <ModelList
        models={models}
        onDelete={onDelete}
        onClickName={onClickName}
        onClickAdd={onClickAdd}
        role={role}
      />
      <ModelForm
        isVisible={isVisible}
        onClose={onClose}
        defaultModelId={defaultModelId}
      />
    </>
  );
};

export default ModelListContainer;
