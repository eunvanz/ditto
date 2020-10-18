import React, { useCallback } from "react";
import ModelForm from "./ModelForm";
import { useDispatch } from "react-redux";
import { ModelNameFormValues } from "./ModelNameForm";
import { ModelDoc } from "../../types";
import { useParams } from "react-router-dom";

export interface ModelFormContainerProps {
  model?: ModelDoc;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({ model }) => {
  const dispatch = useDispatch();

  // 가장 루트의 ModelForm은 이 modelId로 models의 model을 선택
  const { modelId } = useParams();

  const onSubmitModel = useCallback((data: ModelNameFormValues) => {
    dispatch();
  }, []);

  return (
    <ModelForm
      onSubmitModel={() => {}}
      onDeleteModelField={() => {}}
      onSubmitModelField={() => {}}
    />
  );
};

export default ModelFormContainer;
