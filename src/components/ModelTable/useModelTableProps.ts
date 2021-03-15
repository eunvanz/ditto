import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import shortId from "shortid";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { ModelDoc, ModelFieldDoc } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";

export interface UseModelTablePropsParams {
  model?: ModelDoc;
  modelFields?: ModelFieldDoc[];
}

const useModelTableProps = ({
  model,
  modelFields,
}: UseModelTablePropsParams) => {
  const formId = useMemo(() => {
    return shortId.generate();
  }, []);

  const dispatch = useDispatch();

  const { projectId, project } = useProjectByParam();

  const firestoreQuery = useMemo(() => {
    const query = [
      {
        collection: `projects/${projectId}/enumerations`,
        orderBy: ["createdAt", "asc"],
      },
      {
        collection: `projects/${projectId}/models`,
        orderBy: ["createdAt", "asc"],
      },
    ];
    return query;
  }, [projectId]);

  useFirestoreConnect(firestoreQuery as any);

  const projectModels = useSelector(
    FirebaseSelectors.createProjectModelsSelector(projectId)
  );

  const projectEnumerations = useSelector(
    FirebaseSelectors.createProjectEnumerationsSelector(projectId)
  );

  const editingModelField = useSelector(
    ProjectSelectors.selectEditingModelField
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
        dispatch(UiActions.disableModalEscape());
      } else {
        dispatch(ProjectActions.receiveEditingModelField(undefined));
        dispatch(UiActions.enableModalEscape());
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

  const role = useProjectRole(project);

  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  const onRefreshModelField = useCallback(
    (modelField: ModelFieldDoc) => {
      dispatch(ProjectActions.refreshModelField(modelField));
    },
    [dispatch]
  );

  return {
    model,
    modelFields,
    projectModels: projectModels || [],
    projectEnumerations: projectEnumerations || [],
    onSetEditingModelField,
    editingModelFieldId,
    onClickQuickEditModelName,
    onDeleteModelField,
    onSubmitModelField,
    checkIsSubmittingModelField,
    role,
    userProfile,
    onRefreshModelField,
  };
};

export default useModelTableProps;
