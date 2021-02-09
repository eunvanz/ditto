import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import shortId from "shortid";
import { assertNotEmpty } from "../../helpers/commonHelpers";
import { RootState } from "../../store";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelDoc, ModelFieldDoc } from "../../types";
import { ModelFieldFormValues } from "./ModelForm";
import { ModelNameFormValues } from "./ModelNameForm";

const useModelFormProps: (defaultModelId?: string) => any = (
  defaultModelId
) => {
  const formId = useMemo(() => {
    return shortId.generate();
  }, []);

  const dispatch = useDispatch();

  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

  const firestoreQuery = useMemo(() => {
    const query = [
      {
        collection: `projects/${project.id}/enumerations`,
        orderBy: ["createdAt", "asc"],
      },
    ];
    if (defaultModelId) {
      query.push({
        collection: `projects/${project.id}/models/${defaultModelId}/modelFields`,
        orderBy: ["createdAt", "asc"],
      });
    }
    return query;
  }, [defaultModelId, project.id]);

  useFirestoreConnect(firestoreQuery as any);

  const projectModels = useSelector(FirebaseSelectors.selectProjectModels);

  const projectEnumerations = useSelector(
    FirebaseSelectors.createProjectEnumerationsSelector(project.id)
  );

  const modelFields = useSelector(
    FirebaseSelectors.createModelFieldsSelector(project.id, defaultModelId)
  );

  const editingModelField = useSelector(
    (state: RootState) => state.project.editingModelField
  );

  const model = useMemo(() => {
    return projectModels.find((model) => model.id === defaultModelId);
  }, [defaultModelId, projectModels]);

  const onSubmitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitModelNameForm(data));
    },
    [dispatch]
  );

  const onDeleteModelField = useCallback(
    (modelField: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteModelField(modelField));
    },
    [dispatch]
  );

  const onSubmitModelField = useCallback(
    (data: ModelFieldFormValues) => {
      dispatch(
        ProjectActions.submitModelFieldForm({ ...data, modelId: model?.id })
      );
    },
    [dispatch, model]
  );

  const submittingModelFieldActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitModelFieldFormItemActions
  );

  const checkIsSubmittingModelField = useCallback(
    (modelId?: string) => {
      return submittingModelFieldActionsInProgress.includes(
        `${ProjectActions.submitModelFieldForm}-${modelId}`
      );
    },
    [submittingModelFieldActionsInProgress]
  );

  const onSetEditingModelField = useCallback(
    (modelFieldId?: string) => {
      if (modelFieldId) {
        dispatch(
          ProjectActions.receiveEditingModelField({
            modelFieldId,
            formId,
          })
        );
      } else {
        dispatch(ProjectActions.receiveEditingModelField(undefined));
      }
    },
    [dispatch, formId]
  );

  const onClickQuickEditModelName = useCallback(
    (model: ModelDoc) => {
      dispatch(ProjectActions.proceedQuickModelNameForm(model));
    },
    [dispatch]
  );

  const editingModelFieldId = useMemo(() => {
    return editingModelField?.formId === formId
      ? editingModelField.modelFieldId
      : undefined;
  }, [editingModelField, formId]);

  return {
    model,
    modelFields,
    onSubmitModel,
    onDeleteModelField,
    onSubmitModelField,
    projectModels,
    projectEnumerations,
    checkIsSubmittingModelField,
    onSetEditingModelField,
    editingModelFieldId,
    onClickQuickEditModelName,
  };
};

export default useModelFormProps;
