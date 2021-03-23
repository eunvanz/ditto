import { useCallback, useEffect, useMemo, useState } from "react";
import qs from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useLocation } from "react-router-dom";
import { ModelFormContainerProps } from "../../../components/ModelForm/ModelFormContainer";
import useLoading from "../../../hooks/useLoading";
import useProjectRole from "../../../hooks/useProjectRole";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { ModelDoc, ProjectDoc } from "../../../types";
import { ModelListProps } from "./ModelList";

export interface UseModelListPropsParams {
  project: ProjectDoc;
}

const useModelListProps: (
  params: UseModelListPropsParams,
) => ModelListProps & ModelFormContainerProps = ({ project }) => {
  const location = useLocation();

  const modelIdQuery = useMemo(() => {
    return qs.parse(location.search).model;
  }, [location.search]);

  const dispatch = useDispatch();

  useFirestoreConnect({
    collection: `projects/${project.id}/models`,
    orderBy: ["createdAt", "asc"],
  });

  const models = useSelector(FirebaseSelectors.createProjectModelsSelector(project.id));

  const onDelete = useCallback(
    (model: ModelDoc) => {
      dispatch(ProjectActions.deleteModel(model));
    },
    [dispatch],
  );

  const [isModelFormVisible, setIsModelFormVisible] = useState(false);

  const onClickName = useCallback(
    (model: ModelDoc) => {
      dispatch(ProjectActions.receiveCurrentModel(model));
      setIsModelFormVisible(true);
    },
    [dispatch],
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

  useLoading(models, `loadingModels-${project.id}`);

  const model = useSelector(ProjectSelectors.selectCurrentModel);

  const role = useProjectRole(project);

  useEffect(() => {
    if (modelIdQuery) {
      const model = models?.find((item) => item.id === modelIdQuery);
      if (model) {
        onClickName(model);
      }
    }
  }, [modelIdQuery, models, onClickName]);

  return {
    models,
    onDelete,
    onClickName,
    onClickAdd,
    isVisible: isModelFormVisible,
    onClose,
    defaultModelId: model?.id,
    role,
  };
};

export default useModelListProps;
