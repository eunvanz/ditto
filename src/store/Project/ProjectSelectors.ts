import { RootState } from "..";
import { ProjectActions } from "./ProjectSlice";
import { createSelector } from "@reduxjs/toolkit";
import { DATA_KEY } from "../Data/DataSlice";
import { convertRecordToArray } from "../../helpers/commonHelpers";
import orderBy from "lodash/orderBy";
import { ModelDoc, ModelFieldDoc } from "../../types";

const selectIsProjectFormSubmitting = (state: RootState) =>
  state.progress.includes(ProjectActions.submitProjectForm.type);

const selectProjectUrls = createSelector(
  (state: RootState) => state.data[DATA_KEY.PROJECT],
  (state: RootState) => state.data[DATA_KEY.PROJECT_URLS],
  (project, projectUrls) => {
    return projectUrls && project ? projectUrls[project.id] : undefined;
  }
);

const selectProjectModels = createSelector(
  (state: RootState) => state.data[DATA_KEY.PROJECT],
  (state: RootState) => state.data[DATA_KEY.MODELS],
  (project, models) => {
    return project && models?.[project?.id]
      ? orderBy(convertRecordToArray(models[project.id]), [
          "createdAt.seconds",
          "asc",
        ])
      : undefined;
  }
);

const selectForProjectBasicForm = createSelector(
  (state: RootState) => state.data[DATA_KEY.PROJECT],
  selectIsProjectFormSubmitting,
  (project, isSubmitting) => ({
    project,
    isSubmitting,
  })
);

const createModelFormSelector = (modelFormId?: string) =>
  createSelector(
    (state: RootState) => state.data[DATA_KEY.MODELS],
    (state: RootState) => state.data[DATA_KEY.PROJECT],
    (state: RootState) =>
      modelFormId ? state.data[DATA_KEY.MODEL_FORMS]?.[modelFormId] : undefined,
    (state: RootState) => state.data[DATA_KEY.MODEL_FIELDS],
    (models, project, modelId, allModelFields) => {
      const model =
        models && project && modelId ? models[project.id][modelId] : undefined;
      let projectModels: ModelDoc[] = [];
      const modelFields: ModelFieldDoc[] = model
        ? allModelFields?.[model.id] || []
        : [];
      if (models && project) {
        projectModels = convertRecordToArray(models[project.id]);
      }
      return {
        model,
        modelFields,
        projectModels,
      };
    }
  );

const selectListeningFieldsModelIds = createSelector(
  (state: RootState) => state.data[DATA_KEY.MODEL_FIELDS],
  (modelFields) => {
    if (modelFields) {
      return Object.keys(modelFields);
    }
    return [];
  }
);

const selectListeningModelsProjectIds = createSelector(
  (state: RootState) => state.data[DATA_KEY.MODELS],
  (models) => {
    if (models) {
      return Object.keys(models);
    }
    return [];
  }
);

const ProjectSelectors = {
  selectIsProjectFormSubmitting,
  selectProjectUrls,
  selectForProjectBasicForm,
  selectProjectModels,
  createModelFormSelector,
  selectListeningFieldsModelIds,
  selectListeningModelsProjectIds,
};

export default ProjectSelectors;
