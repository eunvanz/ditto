import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import shortId from "shortid";
import { assertNotEmpty } from "../../helpers/commonHelpers";
import { RootState } from "../../store";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
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
    const query = [];
    if (defaultModelId) {
      query.push({
        collection: `projects/${project.id}/models/${defaultModelId}/modelFields`,
        orderBy: ["createdAt", "asc"],
      });
    }
    return query;
  }, [defaultModelId, project.id]);

  useFirestoreConnect(firestoreQuery as any);

  const projectModels = useSelector(
    FirebaseSelectors.createProjectModelsSelector(project.id)
  );

  const modelFields = useSelector(
    FirebaseSelectors.createModelFieldsSelector(project.id, defaultModelId)
  );

  const editingModelField = useSelector(
    (state: RootState) => state.project.editingModelField
  );

  const model = useMemo(() => {
    return projectModels?.find((model) => model.id === defaultModelId);
  }, [defaultModelId, projectModels]);

  const onSubmitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(
        ProjectActions.submitModelNameForm({ ...data, hasToSetResult: true })
      );
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
    modelFields: modelFields || [],
    onSubmitModel,
    projectModels: projectModels || [],
    editingModelFieldId,
  };
};

export default useModelFormProps;
