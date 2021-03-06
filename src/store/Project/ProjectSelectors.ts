import { RootState } from "..";
import { createSelector } from "@reduxjs/toolkit";

const selectCurrentProject = createSelector(
  (state: RootState) => state.project.currentProject,
  (project) => project
);

const selectCurrentModel = createSelector(
  (state: RootState) => state.project.currentModel,
  (model) => model
);

const selectFieldTypeToCreate = createSelector(
  (state: RootState) => state.project.fieldTypeToCreate,
  (fieldType) => fieldType
);

const selectEditingModelField = createSelector(
  (state: RootState) => state.project.editingModelField,
  (editingModelField) => editingModelField
);

const ProjectSelectors = {
  selectCurrentProject,
  selectFieldTypeToCreate,
  selectCurrentModel,
  selectEditingModelField,
};

export default ProjectSelectors;
