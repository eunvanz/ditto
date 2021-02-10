import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { ModelFormContainerProps } from "../../../components/ModelForm/ModelFormContainer";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import useLoading from "../../../hooks/useLoading";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { ModelDoc } from "../../../types";
import { ModelListProps } from "./ModelList";

const useModelListProps: () => ModelListProps &
  ModelFormContainerProps = () => {
  const dispatch = useDispatch();

  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

  useFirestoreConnect({
    collection: `projects/${project.id}/models`,
    orderBy: ["createdAt", "asc"],
  });

  const models = useSelector(
    FirebaseSelectors.createProjectModelsSelector(project.id)
  );

  const onDelete = useCallback(
    (model: ModelDoc) => {
      dispatch(ProjectActions.deleteModel(model));
    },
    [dispatch]
  );

  const [isModelFormVisible, setIsModelFormVisible] = useState(false);

  const onClickName = useCallback(
    (model: ModelDoc) => {
      dispatch(ProjectActions.receiveCurrentModel(model));
      setIsModelFormVisible(true);
    },
    [dispatch]
  );

  const onClickAdd = useCallback(() => {
    dispatch(ProjectActions.clearCurrentModel());
    setIsModelFormVisible(true);
  }, [dispatch]);

  const onClose = useCallback(() => {
    setIsModelFormVisible(false);
    setTimeout(() => {
      dispatch(ProjectActions.clearCurrentModel());
    }, 50);
  }, [dispatch]);

  useLoading(models);

  const model = useSelector(ProjectSelectors.selectCurrentModel);

  return {
    models,
    onDelete,
    onClickName,
    onClickAdd,
    isVisible: isModelFormVisible,
    onClose,
    defaultModelId: model?.id,
  };
};

export default useModelListProps;
