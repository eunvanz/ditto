import React, { useEffect, useCallback, useState } from "react";
import ModelList from "./ModelList";
import { useDispatch, useSelector } from "react-redux";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { UiActions } from "../../../store/Ui/UiSlice";
import { ModelDoc } from "../../../types";
import ModelForm from "../../../components/ModelForm";

const ModelListContainer = () => {
  const dispatch = useDispatch();

  const models = useSelector(ProjectSelectors.selectProjectModels);

  const [model, setModel] = useState<ModelDoc | undefined>(undefined);

  const [isModelFormVisible, setIsModelFormVisible] = useState(false);

  useEffect(() => {
    dispatch(ProjectActions.listenToProjectModels());
    return () => {
      dispatch(ProjectActions.unlistenToProjectModels());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!models) {
      dispatch(UiActions.showLoading());
    } else {
      dispatch(UiActions.hideLoading());
    }
  }, [dispatch, models]);

  const deleteModel = useCallback(
    (model: ModelDoc) => {
      dispatch(ProjectActions.deleteModel(model));
    },
    [dispatch]
  );

  const showModelForm = useCallback((model: ModelDoc) => {
    setModel(model);
    setIsModelFormVisible(true);
  }, []);

  const showNewModelForm = useCallback(() => {
    setModel(undefined);
    setIsModelFormVisible(true);
  }, []);

  return models ? (
    <>
      <ModelList
        models={models}
        onDelete={deleteModel}
        onClickName={showModelForm}
        onClickAdd={showNewModelForm}
      />
      <ModelForm
        key={model?.id}
        isVisible={isModelFormVisible}
        onClose={() => setIsModelFormVisible(false)}
        defaultModelId={model?.id}
      />
    </>
  ) : null;
};

export default ModelListContainer;
