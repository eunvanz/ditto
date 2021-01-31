import React, { useCallback, useMemo, useEffect } from "react";
import ModelForm, { ModelFormModal, ModelFieldFormValues } from "./ModelForm";
import { useDispatch, useSelector } from "react-redux";
import { ModelNameFormValues } from "./ModelNameForm";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import shortId from "shortid";
import { DataActions, DATA_KEY } from "../../store/Data/DataSlice";
import { ModelFieldDoc } from "../../types";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";

export interface ModelFormContainerProps {
  defaultModelId?: string;
  isVisible?: boolean;
  onClose?: () => void;
  depth?: number;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({
  defaultModelId,
  isVisible,
  onClose,
  depth,
}) => {
  const dispatch = useDispatch();

  /**
   * modelForm이 여러개 겹쳐 띄워져 있을 경우 구분하는 id
   */
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
      return () => {
        dispatch(
          DataActions.clearRecordData({
            key: DATA_KEY.MODEL_FORMS,
            recordKey: modelFormId,
          })
        );
      };
    }
  }, [defaultModelId, dispatch, modelFormId]);

  const { model, modelFields, projectModels } = useSelector(
    ProjectSelectors.createModelFormSelector(modelFormId)
  );

  const listeningModelIds = useSelector(
    ProjectSelectors.selectListeningFieldsModelIds
  );

  const submittingModelFieldActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitModelFieldFormItemActions
  );

  const submitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitModelNameForm({ ...data, modelFormId }));
    },
    [dispatch, modelFormId]
  );

  const submitModelField = useCallback(
    (data: ModelFieldFormValues) => {
      dispatch(ProjectActions.submitModelFieldForm({ ...data, modelFormId }));
    },
    [dispatch, modelFormId]
  );

  const deleteModelField = useCallback(
    (modelField: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteModelField(modelField));
    },
    [dispatch]
  );

  useEffect(() => {
    // 이미 listening을 하고 있는 모델에 대해서는 수행하지 않음
    if (model && !listeningModelIds.includes(model.id)) {
      dispatch(ProjectActions.listenToModelFields(model));
      return () => {
        dispatch(ProjectActions.unlistenToModelFields(model));
      };
    }
    // eslint-disable-next-line
  }, [dispatch, model?.id]);

  const checkIsSubmittingModelField = useCallback(
    (modelId?: string) => {
      return submittingModelFieldActionsInProgress.includes(
        `${ProjectActions.submitModelFieldForm}-${modelId}`
      );
    },
    [submittingModelFieldActionsInProgress]
  );

  return onClose ? (
    <ModelFormModal
      model={model}
      modelFields={modelFields}
      onSubmitModel={submitModel}
      onDeleteModelField={deleteModelField}
      onSubmitModelField={submitModelField}
      isVisible={isVisible || false}
      onClose={onClose}
      projectModels={projectModels}
      checkIsSubmittingModelField={checkIsSubmittingModelField}
    />
  ) : (
    <ModelForm
      model={model}
      modelFields={modelFields}
      onSubmitModel={submitModel}
      onDeleteModelField={deleteModelField}
      onSubmitModelField={submitModelField}
      projectModels={projectModels}
      depth={depth}
      checkIsSubmittingModelField={checkIsSubmittingModelField}
    />
  );
};

export default ModelFormContainer;
