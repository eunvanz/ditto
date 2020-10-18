import React, { useCallback } from "react";
import ModelForm from "./ModelForm";
import { useDispatch } from "react-redux";
import { ModelNameFormValues } from "./ModelNameForm";
import { ModelDoc } from "../../types";
import { ProjectActions } from "../../store/Project/ProjectSlice";

export interface ModelFormContainerProps {
  model?: ModelDoc;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({ model }) => {
  const dispatch = useDispatch();

  const submitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitModelNameForm(data));
    },
    [dispatch]
  );

  return (
    <ModelForm
      model={model}
      onSubmitModel={submitModel}
      onDeleteModelField={() => {}}
      onSubmitModelField={() => {}}
    />
  );
};

export default ModelFormContainer;
