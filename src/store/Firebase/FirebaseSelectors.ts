import { createSelector } from "@reduxjs/toolkit";
import orderBy from "lodash/orderBy";
import { RootState } from "..";
import {
  EnumerationDoc,
  GroupDoc,
  ModelDoc,
  ModelFieldDoc,
  ProjectDoc,
  ProjectUrlDoc,
} from "../../types";
import AuthSelectors from "../Auth/AuthSelector";

const selectMyProjects = (state: RootState) =>
  state.firestore.ordered.projects as ProjectDoc[];

const selectOrderedMyProjects = createSelector(
  selectMyProjects,
  AuthSelectors.selectAuth,
  (projects: ProjectDoc[], auth) => {
    return auth
      ? orderBy(projects, [`settingsByMember.${auth.uid}.seq`], ["asc"])
      : [];
  }
);

const createProjectSelectorByProjectId = (projectId: string) =>
  createSelector(
    (state: RootState) => state.firestore.ordered.projects,
    (projects: ProjectDoc[]) => {
      return projects
        ? projects.find((project) => project.id === projectId)
        : undefined;
    }
  );

function createOrderedSelector<T>(key: string) {
  return createSelector(
    (state: RootState) => state.firestore.ordered[key],
    (data) => data as T | undefined
  );
}

const createProjectUrlsSelector = (projectId: string) =>
  createOrderedSelector<ProjectUrlDoc[]>(`projects/${projectId}/urls`);

const createProjectModelsSelector = (projectId: string) =>
  createOrderedSelector<ModelDoc[]>(`projects/${projectId}/models`);

const createProjectEnumerationsSelector = (projectId: string) =>
  createOrderedSelector<EnumerationDoc[]>(`projects/${projectId}/enumerations`);

const createModelFieldsSelector = (projectId: string, modelId?: string) =>
  createOrderedSelector<ModelFieldDoc[]>(
    `projects/${projectId}/models/${modelId}/modelFields`
  );

const createProjectGroupsSelector = (projectId: string) =>
  createOrderedSelector<GroupDoc[]>(`projects/${projectId}/groups`);

const FirebaseSelectors = {
  selectMyProjects,
  selectOrderedMyProjects,
  createProjectSelectorByProjectId,
  createProjectUrlsSelector,
  createProjectEnumerationsSelector,
  createModelFieldsSelector,
  createProjectModelsSelector,
  createProjectGroupsSelector,
};

export default FirebaseSelectors;
