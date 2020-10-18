import { RootState } from "..";
import { ProjectActions } from "./ProjectSlice";
import { createSelector } from "@reduxjs/toolkit";
import { DATA_KEY } from "../Data/DataSlice";
import DataSelectors from "../Data/DataSelectors";
import { ProjectUrlDoc, ProjectDoc, ModelDoc } from "../../types";
import { convertRecordToArray } from "../../helpers/commonHelpers";

const selectIsProjectFormSubmitting = (state: RootState) =>
  state.progress.includes(ProjectActions.submitProjectForm.type);

const selectProjectUrls = createSelector(
  DataSelectors.createDataKeySelector(DATA_KEY.PROJECT),
  DataSelectors.createDataKeySelector(DATA_KEY.PROJECT_URLS),
  (project, projectUrls) => {
    return projectUrls
      ? (projectUrls as Record<string, ProjectUrlDoc[]>)[
          (project as ProjectDoc).id
        ]
      : undefined;
  }
);

const selectProjectModels = createSelector(
  DataSelectors.createDataKeySelector(DATA_KEY.PROJECT),
  DataSelectors.createDataKeySelector(DATA_KEY.MODELS),
  (project, models) => {
    return models
      ? convertRecordToArray(
          (models as Record<string, Record<string, ModelDoc>>)[
            (project as ProjectDoc).id
          ]
        )
      : undefined;
  }
);

const selectForProjectBasicForm = createSelector(
  DataSelectors.createDataKeySelector(DATA_KEY.PROJECT),
  selectIsProjectFormSubmitting,
  (project, isSubmitting) => ({
    project: (project as ProjectDoc) || undefined,
    isSubmitting,
  })
);

const ProjectSelectors = {
  selectIsProjectFormSubmitting,
  selectProjectUrls,
  selectForProjectBasicForm,
  selectProjectModels,
};

export default ProjectSelectors;
