import React, { useCallback } from "react";
import ModelForm, { ModelFormModal } from "./ModelForm";
import { useDispatch } from "react-redux";
import { ModelNameFormValues } from "./ModelNameForm";
import { ModelDoc } from "../../types";
import { ProjectActions } from "../../store/Project/ProjectSlice";

export interface ModelFormContainerProps {
  model?: ModelDoc;
  isVisible?: boolean;
  onClose?: () => void;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({
  model,
  isVisible,
  onClose,
}) => {
  const dispatch = useDispatch();

  const submitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitModelNameForm(data));
    },
    [dispatch]
  );

  return onClose ? (
    <ModelFormModal
      model={model}
      modelFields={[]}
      onSubmitModel={submitModel}
      onDeleteModelField={() => {}}
      onSubmitModelField={() => {}}
      isVisible={isVisible || false}
      onClose={onClose}
    />
  ) : (
    <ModelForm
      model={model}
      modelFields={[]}
      onSubmitModel={submitModel}
      onDeleteModelField={() => {}}
      onSubmitModelField={() => {}}
    />
  );
};

export default ModelFormContainer;
