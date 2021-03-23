import React from "react";
import ModelForm from "../../../components/ModelForm";
import { ProjectDoc } from "../../../types";
import ModelList from "./ModelList";
import useModelListProps from "./useModelListProps";

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
