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
    role,
  } = useModelListProps();

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
