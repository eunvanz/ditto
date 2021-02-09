import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { ModelFormContainerProps } from "../../../components/ModelForm/ModelFormContainer";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ModelDoc } from "../../../types";
import { ModelListProps } from "./ModelList";

const useModelListProps: () => ModelListProps &
  ModelFormContainerProps = () => {
  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

  useFirestoreConnect({
    storeAs: "projectModels",
    collection: `projects/${project.id}/models`,
    orderBy: ["createdAt", "asc"],
  });

  const models = useSelector(FirebaseSelectors.selectProjectModels);

  const firestore = useFirestore();

  const onDelete = useCallback(
    (model: ModelDoc) => {
      firestore.delete(`projects/${project.id}/models/${model.id}`);
    },
    [firestore, project.id]
  );

  const [model, setModel] = useState<ModelDoc | undefined>(undefined);
  const [isModelFormVisible, setIsModelFormVisible] = useState(false);

  const onClickName = useCallback((model: ModelDoc) => {
    setModel(model);
    setIsModelFormVisible(true);
  }, []);

  const onClickAdd = useCallback(() => {
    setModel(undefined);
    setIsModelFormVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setModel(undefined);
    setIsModelFormVisible(false);
  }, []);

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
