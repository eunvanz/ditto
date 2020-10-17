import React from "react";
import ModelForm from "./ModelForm";
import { useDispatch } from "react-redux";

const ModelFormContainer = () => {
  const dispatch = useDispatch();

  return (
    <ModelForm
      onSubmitModel={() => {}}
      onDeleteModelField={() => {}}
      onSubmitModelField={() => {}}
    />
  );
};

export default ModelFormContainer;
