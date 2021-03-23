import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import shortId from "shortid";
import useLoading from "../../hooks/useLoading";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import { RootState } from "../../store";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { ModelNameFormValues } from "./ModelNameForm";

const useModelFormProps: (defaultModelId?: string) => any = (defaultModelId) => {
  const formId = useMemo(() => {
    return shortId.generate();
  }, []);

  const dispatch = useDispatch();

  const { projectId, project } = useProjectByParam();

  const firestoreQuery = useMemo(() => {
    const query = [];
    if (defaultModelId) {
      query.push({
        collection: `projects/${projectId}/models/${defaultModelId}/modelFields`,
        orderBy: ["createdAt", "asc"],
      });
    }
    return query;
  }, [defaultModelId, projectId]);

  useFirestoreConnect(firestoreQuery as any);

  const projectModels = useSelector(
    FirebaseSelectors.createProjectModelsSelector(projectId),
  );

  const modelFields = useSelector(
    FirebaseSelectors.createModelFieldsSelector(projectId, defaultModelId),
  );

  const editingModelField = useSelector(
    (state: RootState) => state.project.editingModelField,
  );

  const model = useMemo(() => {
    return projectModels?.find((model) => model.id === defaultModelId);
  }, [defaultModelId, projectModels]);

  const onSubmitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitModelNameForm({ ...data, hasToSetResult: true }));
    },
    [dispatch],
  );

  const editingModelFieldId = useMemo(() => {
    return editingModelField?.formId === formId
      ? editingModelField.modelFieldId
      : undefined;
  }, [editingModelField, formId]);

  useLoading(modelFields, `loadingModelFields-${model?.id}`, !model);
  useLoading(projectModels, `loadingProjectModels-${projectId}`);

  const role = useProjectRole(project);

  const screenMode = useSelector(UiSelectors.selectScreenMode);

  return {
    model,
    modelFields: modelFields || [],
    onSubmitModel,
    projectModels: projectModels || [],
    editingModelFieldId,
    role,
    screenMode,
  };
};

export default useModelFormProps;
