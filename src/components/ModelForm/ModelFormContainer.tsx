import React, { useCallback, useMemo, useEffect } from "react";
import ModelForm, { ModelFormModal } from "./ModelForm";
import { useDispatch, useSelector } from "react-redux";
import { ModelNameFormValues } from "./ModelNameForm";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import shortId from "shortid";
import { DataActions, DATA_KEY } from "../../store/Data/DataSlice";

export interface ModelFormContainerProps {
  defaultModelId?: string;
  isVisible?: boolean;
  onClose?: () => void;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({
  defaultModelId,
  isVisible,
  onClose,
}) => {
  const dispatch = useDispatch();

  const modelFormId = useMemo(() => {
    return shortId.generate();
  }, []);

  useEffect(() => {
    if (defaultModelId) {
      dispatch(
        DataActions.receiveRecordData({
          key: DATA_KEY.MODEL_FORMS,
          recordKey: modelFormId,
          data: defaultModelId,
        })
      );
    }
    return () => {
      dispatch(
        DataActions.clearRecordData({
          key: DATA_KEY.MODEL_FORMS,
          recordKey: modelFormId,
        })
      );
    };
    // eslint-disable-next-line
  }, []);

  const { model, existingModelNames } = useSelector(
    ProjectSelectors.createModelFormSelector(modelFormId)
  );

  const submitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitModelNameForm({ ...data, modelFormId }));
    },
    [dispatch, modelFormId]
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
      existingModelNames={existingModelNames}
    />
  ) : (
    <ModelForm
      model={model}
      modelFields={[]}
      onSubmitModel={submitModel}
      onDeleteModelField={() => {}}
      onSubmitModelField={() => {}}
      existingModelNames={existingModelNames}
    />
  );
};

export default ModelFormContainer;
