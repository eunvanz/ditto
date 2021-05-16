import { createSelector } from "@reduxjs/toolkit";
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
  Oas,
  OperationObject,
  OasPaths,
  FIELD_TYPE,
  MediaTypeObject,
  ResponseObject,
  HeaderObject,
  FORMAT,
  SchemaObject,
  REQUEST_METHOD,
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
          ...(projects || []),
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

const createProjectResponseStatuses = (projectId: string) =>
  createSelector(
    createProjectSelectorByProjectId(projectId),
    createProjectRequestsSelector(projectId),
    (state: RootState) => state.firestore.ordered,
    (project, requests, ordered) => {
      const result: ResponseStatusDoc[] = [];
      if (project && requests) {
        requests.forEach((request) => {
          ordered[
            `projects/${project.id}/requests/${request.id}/responseStatuses`
          ]?.forEach((responseStatus: ResponseStatusDoc) => {
            result.push(responseStatus);
          });
        });
      }
      return result;
    },
  );

const createProjectModelFieldsSelector = (projectId: string) =>
  createSelector(
    createProjectSelectorByProjectId(projectId),
    createProjectModelsSelector(projectId),
    (state: RootState) => state.firestore.ordered,
    (project, models, ordered) => {
      const result: ModelFieldDoc[] = [];
      if (project && models) {
        models.forEach((model) => {
          ordered[`projects/${project.id}/models/${model.id}/modelFields`]?.forEach(
            (modelField: ModelFieldDoc) => {
              result.push(modelField);
            },
          );
        });
      }
      return result;
    },
  );

const createProjectOpenApiSpecSelector = (projectId: string) =>
  createSelector(
    createProjectSelectorByProjectId(projectId),
    createProjectGroupsSelector(projectId),
    createProjectModelsSelector(projectId),
    createProjectRequestsSelector(projectId),
    createProjectUrlsSelector(projectId),
    createProjectEnumerationsSelector(projectId),
    (state: RootState) => state.firestore.ordered,
    (project, groups, models, requests, urls, enums, ordered) => {
      const getModel = (modelId: string) => {
        return models?.find((model) => model.id === modelId);
      };
      const getEnum = (enumId: string) => {
        return enums?.find((item) => item.id === enumId);
      };
      const getUrl = (urlId: string) => {
        return urls?.find((item) => item.id === urlId);
      };
      const getSchema = (modelField: ModelFieldDoc) => {
        const isObject = modelField.fieldType.value === FIELD_TYPE.OBJECT;
        const isArray = modelField.isArray.value;
        const schema: SchemaObject = isObject
          ? {
              $ref: `#/components/schemas/${getModel(modelField.format.value)?.name}`,
            }
          : {
              type: isArray ? ("array" as const) : modelField.fieldType.value,
              items: isArray
                ? getSchema({
                    ...modelField,
                    isArray: { ...modelField.isArray, value: false },
                  })
                : undefined,
              format:
                modelField.format.value === FORMAT.NONE
                  ? undefined
                  : modelField.format.value,
              enum: modelField.enum.value
                ? getEnum(modelField.enum.value)?.items
                : undefined,
            };
        return schema;
      };

      if (project) {
        const schemas: Record<string, SchemaObject> = {};

        models?.forEach((model) => {
          const modelFields: ModelFieldDoc[] | undefined =
            ordered[`projects/${project.id}/models/${model.id}/modelFields`];
          const properties: Record<string, SchemaObject> = {};
          const required: string[] = [];
          modelFields?.forEach((modelField) => {
            properties[modelField.fieldName.value] = {
              ...getSchema(modelField),
            };
            modelField.isRequired.value && required.push(modelField.fieldName.value);
          });
          schemas[model.name] = {
            type: FIELD_TYPE.OBJECT,
            required: required.length ? required : undefined,
            properties,
          };
        });

        const oas: Oas = {
          openapi: "3.0.0",
          info: {
            title: project.title,
            description: project.description,
            version: "1.0.0",
          },
          servers: urls?.length
            ? urls.map((url) => ({
                url: url.url,
                description: url.label,
              }))
            : undefined,
          tags: groups?.map((group) => ({ name: group.name })) || undefined,
          paths: requests?.length
            ? requests.reduce((map: OasPaths, request) => {
                if (request.path && request.method) {
                  const requestGroupName = request.groupId
                    ? groups?.find((group) => group.id === request.groupId)?.name
                    : undefined;
                  const requestParams: RequestParamDoc[] | undefined =
                    ordered[`projects/${project.id}/requests/${request.id}/params`];
                  const requestBodies: RequestBodyDoc[] | undefined =
                    ordered[`projects/${project.id}/requests/${request.id}/bodies`];
                  const responseStatuses: ResponseStatusDoc[] | undefined =
                    ordered[
                      `projects/${project.id}/requests/${request.id}/responseStatuses`
                    ];

                  const responses: Record<string, ResponseObject> = {};

                  responseStatuses?.forEach((responseStatus) => {
                    const responseBodies: ResponseBodyDoc[] | undefined =
                      ordered[
                        `projects/${project.id}/requests/${request.id}/responseStatuses/${responseStatus.id}/bodies`
                      ];
                    const responseHeaders: ResponseBodyDoc[] | undefined =
                      ordered[
                        `projects/${project.id}/requests/${request.id}/responseStatuses/${responseStatus.id}/headers`
                      ];

                    const content: Record<string, MediaTypeObject> = {};

                    responseBodies?.forEach((responseBody) => {
                      content[responseBody.fieldName.value] = {
                        schema: getSchema(responseBody),
                      };
                    });

                    const headers: Record<string, HeaderObject> = {};

                    responseHeaders?.forEach((responseHeader) => {
                      headers[responseHeader.fieldName.value] = {
                        description: responseHeader.description.value,
                        required: responseHeader.isRequired.value,
                        deprecated: false,
                        schema: getSchema(responseHeader),
                      };
                    });

                    responses[responseStatus.statusCode] = {
                      description: responseStatus.description,
                      content: responseBodies?.length ? content : undefined,
                      headers: responseHeaders?.length ? headers : undefined,
                    };
                  });

                  const requestBodyContent: Record<string, MediaTypeObject> = {};
                  requestBodies?.forEach((requestBody) => {
                    requestBodyContent[requestBody.fieldName.value] = {
                      schema: getSchema(requestBody),
                    };
                  });

                  const operationUrl = request.baseUrl
                    ? getUrl(request.baseUrl)
                    : undefined;

                  const operationObject: OperationObject = {
                    tags: requestGroupName ? [requestGroupName] : undefined,
                    summary: request.summary,
                    description: request.description,
                    operationId: request.operationId,
                    parameters: requestParams?.length
                      ? requestParams?.map((param: RequestParamDoc) => {
                          return {
                            name: param.fieldName.value,
                            in: param.location.toLowerCase(),
                            description: param.description.value,
                            required: param.isRequired.value,
                            deprecated: false,
                            schema: getSchema(param),
                          };
                        })
                      : undefined,
                    requestBody: [
                      REQUEST_METHOD.PATCH,
                      REQUEST_METHOD.POST,
                      REQUEST_METHOD.PUT,
                    ].includes(request.method)
                      ? {
                          description: requestBodies?.[0]?.description.value,
                          content: requestBodies?.length ? requestBodyContent : undefined,
                          required: requestBodies?.[0]?.isRequired.value || false,
                        }
                      : undefined,
                    responses,
                    deprecated: request.isDeprecated || false,
                    servers: operationUrl
                      ? [
                          {
                            url: operationUrl.url,
                            description: operationUrl.label,
                          },
                        ]
                      : undefined,
                  };
                  if (request.path) {
                    map[`/${request.path}`] = {
                      [request.method.toLowerCase() as
                        | "get"
                        | "put"
                        | "post"
                        | "delete"
                        | "patch"]: operationObject,
                    };
                  }
                }
                return map;
              }, {} as OasPaths)
            : {},
          components: {
            schemas,
          },
        };
        return oas;
      }
    },
  );

const selectProgress = createSelector(
  (state: RootState) => state.firestore.status.requesting,
  (requesting) => {
    const requestingKeys = Object.keys(requesting);
    const loadedCnt = requestingKeys.filter((key) => !requesting[key]).length;
    if (requestingKeys.length) {
      return (loadedCnt * 100) / requestingKeys.length;
    }
    return 100;
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
  createProjectOpenApiSpecSelector,
  createProjectResponseStatuses,
  createProjectModelFieldsSelector,
  selectProgress,
};

export default FirebaseSelectors;
