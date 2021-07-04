import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExampleFormValues } from "../../components/ExampleFormModal/ExampleFormModal";
import { GroupFormValues } from "../../components/GroupFormModal/GroupFormModal";
import { ModelFieldFormValues } from "../../components/ModelForm/ModelForm";
import { ModelNameFormValues } from "../../components/ModelForm/ModelNameForm";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";
import { RequestFormValues } from "../../components/RequestFormModal/RequestFormModal";
import { ResponseStatusFormValues } from "../../components/ResponseStatusFormModal/ResponseStatusFormModal";
import { SectionItemType } from "../../layouts/DashboardLayout/NavBar/NavBar";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import { ProjectBasicFormValues } from "../../routes/ProjectManagement/ProjectBasicForm/ProjectBasicForm";
import { ProjectUrlFormValues } from "../../routes/ProjectManagement/ProjectUrlForm/ProjectUrlForm";
import { RequestUrlFormValues } from "../../routes/RequestManagement/RequestUrlForm/RequestUrlForm";
import { RequestSettingFormValues } from "../../routes/RequestManagement/SettingsTab/SettingsTab";
import {
  ProjectDoc,
  ProjectUrlDoc,
  ModelDoc,
  ModelFieldDoc,
  EnumerationDoc,
  FIELD_TYPE,
  GroupDoc,
  REQUEST_PARAM_LOCATION,
  RequestDoc,
  ResponseStatusDoc,
  UserProfileDoc,
  MemberRole,
  RequestParamDoc,
  RequestBodyDoc,
  ResponseHeaderDoc,
  ResponseBodyDoc,
} from "../../types";

export type ProjectState = {
  editingModelField?: {
    formId?: string;
    modelFieldId?: string;
  };
  createdModelId?: string;
  createdEnumId?: string;
  fieldTypeToCreate?: FIELD_TYPE;
  currentProject?: ProjectDoc;
  currentModel?: ModelDoc;
  myProjects: ProjectDoc[];
  groups: { [projectId: string]: GroupDoc[] };
  requests: { [projectId: string]: RequestDoc[] };
  modelFields: {
    [modelId: string]: ModelFieldDoc[];
  };
  requestParams: {
    [requestId: string]: RequestParamDoc[];
  };
  responseStatuses: {
    [requestId: string]: ResponseStatusDoc[];
  };
  responseBodies: {
    [responseStatusId: string]: ResponseBodyDoc[];
  };
  responseHeaders: {
    [responseStatusId: string]: ResponseHeaderDoc[];
  };
  requestBodies: {
    [requestId: string]: RequestBodyDoc[];
  };
};

export const initialProjectState: ProjectState = {
  myProjects: [],
  groups: {},
  requests: {},
  modelFields: {},
  requestParams: {},
  requestBodies: {},
  responseStatuses: {},
  responseBodies: {},
  responseHeaders: {},
};

export interface SubmitProjectFormPayload {
  data: ProjectBasicFormValues | ProjectFormValues;
  type: "create" | "modify";
}

export interface ReorderNavBarItemPayload {
  type: SectionItemType;
  itemId: string;
  destinationId: string;
  destinationIndex: number;
  projectId: string;
}

const ProjectSlice = createSlice({
  name: "Project",
  initialState: initialProjectState,
  reducers: {
    receiveCurrentProject: (state, action: PayloadAction<ProjectDoc>) => {
      state.currentProject = action.payload;
    },
    receiveEditingModelField: (
      state,
      action: PayloadAction<
        | {
            formId?: string;
            modelFieldId?: string;
          }
        | undefined
      >,
    ) => {
      state.editingModelField = action.payload;
    },
    receiveCreatedModelId: (state, action: PayloadAction<string>) => {
      state.createdModelId = action.payload;
    },
    receiveCreatedEnumId: (state, action: PayloadAction<string>) => {
      state.createdEnumId = action.payload;
    },
    receiveFieldTypeToCreate: (state, action: PayloadAction<FIELD_TYPE>) => {
      state.fieldTypeToCreate = action.payload;
    },
    receiveCurrentModel: (state, action: PayloadAction<ModelDoc>) => {
      state.currentModel = action.payload;
    },
    clearCurrentModel: (state, _action: PayloadAction<void>) => {
      state.currentModel = undefined;
    },
    receiveMyProjects: (state, action: PayloadAction<ProjectDoc[]>) => {
      state.myProjects = action.payload;
    },
    clearMyProjects: (state, _action: PayloadAction<void>) => {
      state.myProjects = [];
    },
    receiveGroups: (state, action: PayloadAction<Record<string, GroupDoc[]>>) => {
      state.groups = action.payload;
    },
    receiveRequests: (state, action: PayloadAction<Record<string, RequestDoc[]>>) => {
      state.requests = action.payload;
    },
    receiveModelFields: (
      state,
      action: PayloadAction<{
        modelId: string;
        modelFields: ModelFieldDoc[];
      }>,
    ) => {
      const { modelId, modelFields } = action.payload;
      state.modelFields[modelId] = modelFields;
    },
    pushModelField: (state, action: PayloadAction<ModelFieldDoc>) => {
      state.modelFields[action.payload.modelId].push(action.payload);
    },
    replaceModelField: (state, action: PayloadAction<ModelFieldDoc>) => {
      const index = state.modelFields[action.payload.modelId].findIndex(
        (item) => item.id === action.payload.id,
      );
      state.modelFields[action.payload.modelId][index] = action.payload;
    },
    receiveResponseStatuses: (
      state,
      action: PayloadAction<{
        requestId: string;
        responseStatuses: ResponseStatusDoc[];
      }>,
    ) => {
      const { requestId, responseStatuses } = action.payload;
      state.responseStatuses[requestId] = responseStatuses;
    },
    pushResponseStatus: (state, action: PayloadAction<ResponseStatusDoc>) => {
      state.responseStatuses[action.payload.requestId].push(action.payload);
    },
    receiveRequestParams: (
      state,
      action: PayloadAction<{
        requestId: string;
        requestParams: RequestParamDoc[];
      }>,
    ) => {
      const { requestId, requestParams } = action.payload;
      state.requestParams[requestId] = requestParams;
    },
    pushRequestParam: (state, action: PayloadAction<RequestParamDoc>) => {
      state.requestParams[action.payload.requestId].push(action.payload);
    },
    replaceRequestParam: (state, action: PayloadAction<RequestParamDoc>) => {
      const index = state.requestParams[action.payload.requestId].findIndex(
        (item) => item.id === action.payload.id,
      );
      state.requestParams[action.payload.requestId][index] = action.payload;
    },
    submitProjectForm: (_, _action: PayloadAction<SubmitProjectFormPayload>) => {},
    deleteProject: (_, _action: PayloadAction<ProjectDoc>) => {},
    submitProjectUrlForm: (_, _action: PayloadAction<ProjectUrlFormValues>) => {},
    deleteProjectUrl: (_, _action: PayloadAction<ProjectUrlDoc>) => {},
    submitModelNameForm: (
      _,
      _action: PayloadAction<ModelNameFormValues & { hasToSetResult?: boolean }>,
    ) => {},
    submitModelFieldForm: (
      _,
      _action: PayloadAction<ModelFieldFormValues & { modelId?: string }>,
    ) => {},
    deleteModel: (_, _action: PayloadAction<ModelDoc>) => {},
    deleteModelField: (_, _action: PayloadAction<ModelFieldDoc>) => {},
    submitQuickModelNameForm: (_, _action: PayloadAction<ModelNameFormValues>) => {},
    cancelQuickModelNameForm: (_, _action: PayloadAction<void>) => {},
    proceedQuickModelNameForm: (_, _action: PayloadAction<ModelDoc>) => {},
    notifySubmissionQuickModelNameFormComplete: (_, _action: PayloadAction<void>) => {},
    submitEnumForm: (_, _action: PayloadAction<EnumFormValues>) => {},
    deleteEnumeration: (_, _action: PayloadAction<EnumerationDoc>) => {},
    submitQuickEnumForm: (_, _action: PayloadAction<EnumFormValues>) => {},
    notifySubmissionQuickEnumFormComplete: (_, _action: PayloadAction<void>) => {},
    submitGroupForm: (_, _action: PayloadAction<GroupFormValues>) => {},
    deleteGroup: (_, _action: PayloadAction<GroupDoc>) => {},
    submitRequestForm: (_, _action: PayloadAction<RequestFormValues>) => {},
    submitRequestUrlForm: (_, _action: PayloadAction<RequestUrlFormValues>) => {},
    notifySubmissionQuickUrlFormComplete: (
      _,
      _action: PayloadAction<{ createdUrlId: string }>,
    ) => {},
    submitRequestParamForm: (
      _,
      _action: PayloadAction<
        ModelFieldFormValues & {
          requestId: string;
          location: REQUEST_PARAM_LOCATION;
        }
      >,
    ) => {},
    deleteRequestParam: (_, _action: PayloadAction<RequestParamDoc>) => {},
    submitRequestBodyForm: (
      _,
      _action: PayloadAction<ModelFieldFormValues & { requestId: string }>,
    ) => {},
    deleteRequestBody: (_, _action: PayloadAction<RequestBodyDoc>) => {},
    submitRequestSettingForm: (_, _action: PayloadAction<RequestSettingFormValues>) => {},
    deleteRequest: (_, _action: PayloadAction<RequestDoc>) => {},
    submitResponseStatus: (
      _,
      _action: PayloadAction<
        ResponseStatusFormValues & { projectId: string; requestId: string }
      >,
    ) => {},
    deleteResponseStatus: (_, _action: PayloadAction<ResponseStatusDoc>) => {},
    submitResponseBodyForm: (
      _,
      _action: PayloadAction<
        ModelFieldFormValues & {
          requestId: string;
          projectId: string;
          responseStatusId: string;
        }
      >,
    ) => {},
    deleteResponseBody: (_, _action: PayloadAction<ResponseBodyDoc>) => {},
    submitResponseHeaderForm: (
      _,
      _action: PayloadAction<
        ModelFieldFormValues & {
          requestId: string;
          projectId: string;
          responseStatusId: string;
        }
      >,
    ) => {},
    deleteResponseHeader: (_, _action: PayloadAction<ResponseHeaderDoc>) => {},
    changeMemberRole: (
      _,
      _action: PayloadAction<{
        member: UserProfileDoc;
        oldRole: MemberRole;
        newRole: MemberRole;
      }>,
    ) => {},
    deleteMember: (
      _,
      _action: PayloadAction<{ member: UserProfileDoc; role: MemberRole }>,
    ) => {},
    addMembers: (
      _,
      _action: PayloadAction<{ members: UserProfileDoc[]; role: MemberRole }>,
    ) => {},
    markNotificationsAsRead: (_, _action: PayloadAction<string[]>) => {},
    refreshModelField: (_, _action: PayloadAction<ModelFieldDoc>) => {},
    submitExamples: (_, _action: PayloadAction<ExampleFormValues>) => {},
    generateTypescriptInterface: (_, _action: PayloadAction<ModelDoc>) => {},
    generateMockData: (_, _action: PayloadAction<ModelDoc>) => {},
    refactorProjectsAsLinkedList: (_, _action: PayloadAction<void>) => {},
    refactorGroupsAsLinkedList: (_, _action: PayloadAction<void>) => {},
    refactorRequestsAsLinkedList: (_, _action: PayloadAction<void>) => {},
    reorderNavBarItem: (_, _action: PayloadAction<ReorderNavBarItemPayload>) => {},
    receiveLatestMyProjects: (_, _action: PayloadAction<ProjectDoc[]>) => {},
    receiveLatestGroups: (_, _action: PayloadAction<Record<string, GroupDoc[]>>) => {},
    receiveLatestRequests: (
      _,
      _action: PayloadAction<Record<string, RequestDoc[]>>,
    ) => {},
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
