import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getOrderedItems } from "../../helpers/projectHelpers";
import AuthSelectors from "../Auth/AuthSelector";

const selectCurrentProject = createSelector(
  (state: RootState) => state.project.currentProject,
  (project) => project,
);

const selectCurrentModel = createSelector(
  (state: RootState) => state.project.currentModel,
  (model) => model,
);

const selectFieldTypeToCreate = createSelector(
  (state: RootState) => state.project.fieldTypeToCreate,
  (fieldType) => fieldType,
);

const selectEditingModelField = createSelector(
  (state: RootState) => state.project.editingModelField,
  (editingModelField) => editingModelField,
);

const selectMyProjects = createSelector(
  (state: RootState) => state.project.myProjects,
  AuthSelectors.selectAuth,
  (myProjects, auth) => getOrderedItems(myProjects, auth.uid),
);

const ProjectSelectors = {
  selectCurrentProject,
  selectFieldTypeToCreate,
  selectCurrentModel,
  selectEditingModelField,
  selectMyProjects,
};

export default ProjectSelectors;
