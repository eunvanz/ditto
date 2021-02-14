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
  RequestDoc,
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

const createGroupedProjectGroupsSelector = (projectIds: string[]) =>
  createSelector(
    (state: RootState) =>
      projectIds.map(
        (projectId) => state.firestore.ordered[`projects/${projectId}/groups`]
      ),
    (projectGroupsArray: GroupDoc[][]) => {
      const groupedProjectGroups: Record<string, GroupDoc[]> = {};
      projectGroupsArray.forEach((projectGroups) => {
        if (projectGroups?.length) {
          const projectId = projectGroups[0].projectId;
          groupedProjectGroups[projectId] = projectGroups;
        }
      });
      return groupedProjectGroups;
    }
  );

const createGroupedProjectRequestsSelector = (projectIds: string[]) =>
  createSelector(
    (state: RootState) =>
      projectIds.map(
        (projectId) => state.firestore.ordered[`projects/${projectId}/requests`]
      ),
    (projectRequestsArray: RequestDoc[][]) => {
      const groupedProjectRequests: Record<string, RequestDoc[]> = {};
      projectRequestsArray.forEach((projectRequests) => {
        if (projectRequests?.length) {
          const projectId = projectRequests[0].projectId;
          groupedProjectRequests[projectId] = projectRequests;
        }
      });
      return groupedProjectRequests;
    }
  );

const FirebaseSelectors = {
  selectMyProjects,
  selectOrderedMyProjects,
  createProjectSelectorByProjectId,
  createProjectUrlsSelector,
  createProjectEnumerationsSelector,
  createModelFieldsSelector,
  createProjectModelsSelector,
  createProjectGroupsSelector,
  createGroupedProjectGroupsSelector,
  createGroupedProjectRequestsSelector,
};

export default FirebaseSelectors;
