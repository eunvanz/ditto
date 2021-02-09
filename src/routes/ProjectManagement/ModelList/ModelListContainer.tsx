import React from "react";
import ModelList from "./ModelList";
import ModelForm from "../../../components/ModelForm";
import useModelListProps from "./useModelListProps";

const ModelListContainer = () => {
  const {
    models,
    onDelete,
    onClickName,
    onClickAdd,
    isVisible,
    onClose,
    defaultModelId,
  } = useModelListProps();

  return models ? (
    <>
      <ModelList
        models={models}
        onDelete={onDelete}
        onClickName={onClickName}
        onClickAdd={onClickAdd}
      />
      <ModelForm
        key={defaultModelId}
        isVisible={isVisible}
        onClose={onClose}
        defaultModelId={defaultModelId}
      />
    </>
  ) : null;
};

export default ModelListContainer;
