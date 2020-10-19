import { RootState } from "..";
import { ProjectActions } from "./ProjectSlice";
import { createSelector } from "@reduxjs/toolkit";
import { DATA_KEY } from "../Data/DataSlice";
import { convertRecordToArray } from "../../helpers/commonHelpers";

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
    return models && project
      ? convertRecordToArray(models[project.id])
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
    (models, project, modelId) => {
      const model =
        models && project && modelId ? models[project.id][modelId] : undefined;
      const existingModelNames: string[] = [];
      if (models && project) {
        const projectModels = models[project.id];
        convertRecordToArray(projectModels).forEach((item) => {
          if (!modelId || item.id !== modelId) {
            existingModelNames.push(item.name);
          }
        });
      }
      return {
        model,
        existingModelNames,
      };
    }
  );

const ProjectSelectors = {
  selectIsProjectFormSubmitting,
  selectProjectUrls,
  selectForProjectBasicForm,
  selectProjectModels,
  createModelFormSelector,
};

export default ProjectSelectors;
