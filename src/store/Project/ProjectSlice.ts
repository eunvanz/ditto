import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";
import {
  ProjectDoc,
  ProjectUrlDoc,
  ModelDoc,
  ModelFieldDoc,
  EnumerationDoc,
  FIELD_TYPE,
} from "../../types";
import { ProjectBasicFormValues } from "../../routes/ProjectManagement/ProjectBasicForm/ProjectBasicForm";
import { ProjectUrlFormValues } from "../../routes/ProjectManagement/ProjectUrlForm/ProjectUrlForm";
import { ModelNameFormValues } from "../../components/ModelForm/ModelNameForm";
import { ModelFieldFormValues } from "../../components/ModelForm/ModelForm";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import { GroupFormValues } from "../../components/GroupFormModal/GroupFormModal";

export type ProjectState = {
  editingModelField?: {
    formId?: string;
    modelFieldId?: string;
  };
  createdModelId?: string;
  createdEnumId?: string;
  fieldTypeToCreate?: FIELD_TYPE;
  currentProject?: ProjectDoc;
};

export const initialProjectState: ProjectState = {};

export interface SubmitProjectFormPayload {
  data: ProjectBasicFormValues | ProjectFormValues;
  type: "create" | "modify";
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
      >
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
    submitProjectForm: (
      _,
      _action: PayloadAction<SubmitProjectFormPayload>
    ) => {},
    deleteProject: (_, _action: PayloadAction<ProjectDoc>) => {},
    submitProjectUrlForm: (
      _,
      _action: PayloadAction<ProjectUrlFormValues>
    ) => {},
    deleteProjectUrl: (_, _action: PayloadAction<ProjectUrlDoc>) => {},
    submitModelNameForm: (_, _action: PayloadAction<ModelNameFormValues>) => {},
    submitModelFieldForm: (
      _,
      _action: PayloadAction<ModelFieldFormValues & { modelId?: string }>
    ) => {},
    deleteModel: (_, _action: PayloadAction<ModelDoc>) => {},
    deleteModelField: (_, _action: PayloadAction<ModelFieldDoc>) => {},
    submitQuickModelNameForm: (
      _,
      _action: PayloadAction<ModelNameFormValues>
    ) => {},
    cancelQuickModelNameForm: (_, _action: PayloadAction<void>) => {},
    proceedQuickModelNameForm: (_, _action: PayloadAction<ModelDoc>) => {},
    notifySubmissionQuickModelNameFormComplete: (
      _,
      _action: PayloadAction<void>
    ) => {},
    submitEnumForm: (_, _action: PayloadAction<EnumFormValues>) => {},
    deleteEnumeration: (_, _action: PayloadAction<EnumerationDoc>) => {},
    submitQuickEnumForm: (_, _action: PayloadAction<EnumFormValues>) => {},
    notifySubmissionQuickEnumFormComplete: (
      _,
      _action: PayloadAction<void>
    ) => {},
    submitGroupForm: (_, _action: PayloadAction<GroupFormValues>) => {},
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
