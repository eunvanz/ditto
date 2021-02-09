import { RootState } from "..";
import { createSelector } from "@reduxjs/toolkit";
import { DATA_KEY } from "../Data/DataSlice";
import { convertRecordToArray } from "../../helpers/commonHelpers";
import orderBy from "lodash/orderBy";

const selectCurrentProject = createSelector(
  (state: RootState) => state.project.currentProject,
  (project) => project
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

const selectListeningEnumerationsProjectIds = createSelector(
  (state: RootState) => state.data[DATA_KEY.ENUMERATIONS],
  (models) => {
    if (models) {
      return Object.keys(models);
    }
    return [];
  }
);

const selectProjectEnumerations = createSelector(
  (state: RootState) => state.data[DATA_KEY.PROJECT],
  (state: RootState) => state.data[DATA_KEY.ENUMERATIONS],
  (project, enumerations) => {
    return project && enumerations?.[project?.id]
      ? orderBy(convertRecordToArray(enumerations[project.id]), [
          "createdAt.seconds",
          "asc",
        ])
      : undefined;
  }
);

const selectFieldTypeToCreate = createSelector(
  (state: RootState) => state.project.fieldTypeToCreate,
  (fieldType) => fieldType
);

const ProjectSelectors = {
  selectCurrentProject,
  selectProjectModels,
  selectListeningFieldsModelIds,
  selectListeningModelsProjectIds,
  selectListeningEnumerationsProjectIds,
  selectProjectEnumerations,
  selectFieldTypeToCreate,
};

export default ProjectSelectors;
