import { createSelector } from "@reduxjs/toolkit";
import orderBy from "lodash/orderBy";
import { RootState } from "..";
import { ProjectDoc } from "../../types";
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

const FirebaseSelectors = {
  selectMyProjects,
  selectOrderedMyProjects,
  createProjectSelectorByProjectId,
  selectProjectUrls,
};

export default FirebaseSelectors;
