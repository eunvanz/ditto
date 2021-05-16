import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getOrderedItems, getOrderedProjects } from "../../helpers/projectHelpers";
import { GroupDoc, RequestDoc } from "../../types";
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
  (myProjects, auth) => getOrderedProjects(myProjects, auth.uid),
);

const selectGroups = createSelector(
  (state: RootState) => state.project.groups,
  (groups) => {
    const keys = Object.keys(groups);
    const result: Record<string, GroupDoc[]> = {};
    keys.forEach((key) => {
      result[key] = getOrderedItems(groups[key]);
    });
    return result;
  },
);

const selectRequests = createSelector(
  (state: RootState) => state.project.requests,
  (requests) => {
    const keys = Object.keys(requests);
    const result: Record<string, RequestDoc[]> = {};
    keys.forEach((key) => {
      result[key] = getOrderedItems(requests[key]);
    });
    return result;
  },
);

const ProjectSelectors = {
  selectCurrentProject,
  selectFieldTypeToCreate,
  selectCurrentModel,
  selectEditingModelField,
  selectMyProjects,
  selectGroups,
  selectRequests,
};

export default ProjectSelectors;
