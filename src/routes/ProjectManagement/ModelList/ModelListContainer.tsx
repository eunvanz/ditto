import React, { useEffect, useCallback } from "react";
import ModelList from "./ModelList";
import { useDispatch, useSelector } from "react-redux";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { UiActions } from "../../../store/Ui/UiSlice";
import { ModelDoc } from "../../../types";

const ModelListContainer = () => {
  const dispatch = useDispatch();

  const models = useSelector(ProjectSelectors.selectProjectModels);

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

  const deleteModel = useCallback((model: ModelDoc) => {}, []);

  const showModelForm = useCallback((model: ModelDoc) => {}, []);

  const showNewModelForm = useCallback(() => {}, []);

  return models ? (
    <ModelList
      models={models}
      onDelete={deleteModel}
      onClickName={showModelForm}
      onClickAdd={showNewModelForm}
    />
  ) : null;
};

export default ModelListContainer;
