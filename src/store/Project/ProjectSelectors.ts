import { RootState } from "..";
import { createSelector } from "@reduxjs/toolkit";

const selectCurrentProject = createSelector(
  (state: RootState) => state.project.currentProject,
  (project) => project
);

const selectFieldTypeToCreate = createSelector(
  (state: RootState) => state.project.fieldTypeToCreate,
  (fieldType) => fieldType
);

const ProjectSelectors = {
  selectCurrentProject,
  selectFieldTypeToCreate,
};

export default ProjectSelectors;
