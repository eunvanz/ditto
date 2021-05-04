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
};

export const initialProjectState: ProjectState = {};

export interface SubmitProjectFormPayload {
  data: ProjectBasicFormValues | ProjectFormValues;
  type: "create" | "modify";
}

export interface ReorderNavBarItemPayload {
  type: SectionItemType;
  itemId: string;
  destinationId: string;
  destinationIndex: number;
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
    reorderNavBarItem: (_, _action: PayloadAction<ReorderNavBarItemPayload>) => {},
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
