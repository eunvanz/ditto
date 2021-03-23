import { createSelector } from "@reduxjs/toolkit";
import orderBy from "lodash/orderBy";
import { RootState } from "..";
import {
  AppInfo,
  EnumerationDoc,
  GroupDoc,
  ModelDoc,
  ModelFieldDoc,
  NotificationDoc,
  ProjectDoc,
  ProjectUrlDoc,
  RequestBodyDoc,
  RequestDoc,
  RequestParamDoc,
  REQUEST_PARAM_LOCATION,
  ResponseBodyDoc,
  ResponseHeaderDoc,
  ResponseStatusDoc,
  UserProfileDoc,
} from "../../types";
import AuthSelectors from "../Auth/AuthSelector";

const selectMyProjects = (state: RootState) =>
  state.firestore.ordered.projects as ProjectDoc[];

const selectExampleProject = createSelector(
  (state: RootState) => state.firestore.ordered.exampleProject,
  (project) => (project?.[0] as ProjectDoc) || undefined,
);

const selectOrderedMyProjects = createSelector(
  selectMyProjects,
  AuthSelectors.selectAuth,
  selectExampleProject,
  (projects: ProjectDoc[], auth, exampleProject) => {
    return auth
      ? [
          ...(exampleProject?.members[auth.uid]
            ? []
            : exampleProject
            ? [exampleProject]
            : []),
          ...orderBy(projects, [`settingsByMember.${auth.uid}.seq`], ["asc"]),
        ]
      : [];
  },
);

const createProjectSelectorByProjectId = (projectId: string) =>
  createSelector(selectOrderedMyProjects, (projects: ProjectDoc[]) => {
    return projects ? projects.find((project) => project.id === projectId) : undefined;
  });

function createOrderedSelector<T>(key: string) {
  return createSelector(
    (state: RootState) => state.firestore.ordered[key],
    (data) => data as T | undefined,
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
    `projects/${projectId}/models/${modelId}/modelFields`,
  );

const createProjectGroupsSelector = (projectId: string) =>
  createOrderedSelector<GroupDoc[]>(`projects/${projectId}/groups`);

const createGroupedProjectGroupsSelector = (projectIds: string[]) =>
  createSelector(
    (state: RootState) =>
      projectIds.map(
        (projectId) => state.firestore.ordered[`projects/${projectId}/groups`],
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
    },
  );

const createGroupedProjectRequestsSelector = (projectIds: string[]) =>
  createSelector(
    (state: RootState) =>
      projectIds.map(
        (projectId) => state.firestore.ordered[`projects/${projectId}/requests`],
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
    },
  );

const createRequestSelectorByProjectIdAndRequestId = (
  projectId: string,
  requestId: string,
) =>
  createSelector(
    (state: RootState) =>
      // react redux firebase의 버그로 인해 ordered 사용
      state.firestore.ordered[`projects/${projectId}/requests`],
    (requests) =>
      requests ? requests.find((item: RequestDoc) => item.id === requestId) : undefined,
  );

const createProjectRequestsSelector = (projectId: string) =>
  createSelector(
    (state: RootState) => state.firestore.ordered[`projects/${projectId}/requests`],
    (requests: RequestDoc[]) => requests,
  );

const createRequestParamsSelector = (
  projectId: string,
  requestId: string,
  location?: REQUEST_PARAM_LOCATION,
) =>
  createSelector(
    (state: RootState) =>
      state.firestore.ordered[`projects/${projectId}/requests/${requestId}/params`],
    (params: RequestParamDoc[] | undefined) => {
      if (location) {
        return params?.filter((param) => param.location === location);
      } else {
        return params;
      }
    },
  );

const createRequestBodiesSelector = (projectId: string, requestId: string) =>
  createOrderedSelector<RequestBodyDoc[]>(
    `projects/${projectId}/requests/${requestId}/bodies`,
  );

const createResponseStatusesSelector = (projectId: string, requestId: string) =>
  createOrderedSelector<ResponseStatusDoc[]>(
    `projects/${projectId}/requests/${requestId}/responseStatuses`,
  );

const createResponseBodiesSelector = (
  projectId: string,
  requestId: string,
  responseStatusId: string,
) =>
  createOrderedSelector<ResponseBodyDoc[]>(
    `projects/${projectId}/requests/${requestId}/responseStatuses/${responseStatusId}/bodies`,
  );

const createResponseHeadersSelector = (
  projectId: string,
  requestId: string,
  responseStatusId: string,
) =>
  createOrderedSelector<ResponseHeaderDoc[]>(
    `projects/${projectId}/requests/${requestId}/responseStatuses/${responseStatusId}/headers`,
  );

const selectUserProfile = createSelector(
  (state: RootState) => state.firebase.profile,
  (profile) => profile,
);

const createProjectMembersSelector = (projectId: string) =>
  createOrderedSelector<UserProfileDoc[]>(`projectMembers/${projectId}`);

const selectSearchUserResult = createOrderedSelector<UserProfileDoc[]>(
  "searchUserResult",
);

const selectNotifications = createOrderedSelector<NotificationDoc[]>("notifications");

const selectAppInfo = (state: RootState) =>
  state.firestore.data.app?.info as AppInfo | undefined;

const selectPermissionErrors = createSelector(
  (state: RootState) => state.firestore.errors,
  (errors) => {
    const errorKeys = Object.keys(errors.byQuery);
    const result: string[] = [];
    if (errorKeys) {
      errorKeys.forEach(
        (errorKey) =>
          errors.byQuery[errorKey].code === "permission-denied" && result.push(errorKey),
      );
    }
    return result;
  },
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
  createRequestSelectorByProjectIdAndRequestId,
  createProjectRequestsSelector,
  createRequestParamsSelector,
  createRequestBodiesSelector,
  createResponseStatusesSelector,
  createResponseBodiesSelector,
  createResponseHeadersSelector,
  selectUserProfile,
  createProjectMembersSelector,
  selectSearchUserResult,
  selectExampleProject,
  selectNotifications,
  selectAppInfo,
  selectPermissionErrors,
};

export default FirebaseSelectors;
