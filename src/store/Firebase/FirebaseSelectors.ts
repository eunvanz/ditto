import { createSelector } from "@reduxjs/toolkit";
import orderBy from "lodash/orderBy";
import { RootState } from "..";
import {
  EnumerationDoc,
  ModelDoc,
  ModelFieldDoc,
  ProjectDoc,
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

const selectProjectUrls = createSelector(
  (state: RootState) => state.firestore.ordered.projectUrls,
  (urls) => urls
);

const selectProjectModels = createSelector(
  (state: RootState) => state.firestore.ordered.projectModels as ModelDoc[],
  (models) => models
);

const createProjectEnumerationsSelector = (projectId: string) =>
  createSelector(
    (state: RootState) => state.firestore,
    (firestore) =>
      firestore.ordered[
        `projects/${projectId}/enumerations`
      ] as EnumerationDoc[]
  );

const createModelFieldsSelector = (projectId: string, modelId?: string) =>
  createSelector(
    (state: RootState) => state.firestore,
    (firestore) => {
      return modelId
        ? (firestore.ordered[
            `projects/${projectId}/models/${modelId}/modelFields`
          ] as ModelFieldDoc[])
        : undefined;
    }
  );

const FirebaseSelectors = {
  selectMyProjects,
  selectOrderedMyProjects,
  createProjectSelectorByProjectId,
  selectProjectUrls,
  selectProjectModels,
  createProjectEnumerationsSelector,
  createModelFieldsSelector,
};

export default FirebaseSelectors;
