import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";
import {
  ProjectDoc,
  ProjectUrlDoc,
  ModelDoc,
  ModelFieldDoc,
} from "../../types";
import { ProjectBasicFormValues } from "../../routes/ProjectManagement/ProjectBasicForm/ProjectBasicForm";
import { ProjectUrlFormValues } from "../../routes/ProjectManagement/ProjectUrlForm/ProjectUrlForm";
import { ModelNameFormValues } from "../../components/ModelForm/ModelNameForm";
import { ModelFieldFormValues } from "../../components/ModelForm/ModelForm";

export type ProjectState = {};

export const initialProjectState: ProjectState = {};

export interface SubmitProjectFormPayload {
  data: ProjectBasicFormValues | ProjectFormValues;
  type: "create" | "modify";
}

const ProjectSlice = createSlice({
  name: "Project",
  initialState: initialProjectState,
  reducers: {
    submitProjectForm: (
      _,
      _action: PayloadAction<SubmitProjectFormPayload>
    ) => {},
    listenToMyProjects: (_, _action: PayloadAction<void>) => {},
    deleteProject: (_, _action: PayloadAction<ProjectDoc>) => {},
    submitProjectUrlForm: (
      _,
      _action: PayloadAction<ProjectUrlFormValues>
    ) => {},
    listenToProjectUrls: (_, _action: PayloadAction<void>) => {},
    unlistenToProjectUrls: (_, _action: PayloadAction<void>) => {},
    deleteProjectUrl: (_, _action: PayloadAction<ProjectUrlDoc>) => {},
    submitModelNameForm: (
      _,
      _action: PayloadAction<ModelNameFormValues & { modelFormId: string }>
    ) => {},
    submitModelFieldForm: (
      _,
      _action: PayloadAction<ModelFieldFormValues & { modelFormId: string }>
    ) => {},
    listenToModel: (
      _,
      _action: PayloadAction<{
        projectId: string;
        modelId: string;
      }>
    ) => {},
    unlistenToModel: (_, _action: PayloadAction<void>) => {},
    listenToProjectModels: (_, _action: PayloadAction<void>) => {},
    unlistenToProjectModels: (_, _action: PayloadAction<void>) => {},
    listenToModelFields: (_, _action: PayloadAction<ModelDoc>) => {},
    unlistenToModelFields: (_, _action: PayloadAction<ModelDoc>) => {},
    deleteModel: (_, _action: PayloadAction<ModelDoc>) => {},
    deleteModelField: (_, _action: PayloadAction<ModelFieldDoc>) => {},
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
