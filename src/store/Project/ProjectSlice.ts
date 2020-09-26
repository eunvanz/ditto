import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";

export type ProjectState = {};

export const initialProjectState: ProjectState = {};

const ProjectSlice = createSlice({
  name: "Project",
  initialState: initialProjectState,
  reducers: {
    submitProjectForm: (_, _action: PayloadAction<ProjectFormValues>) => {},
    listenToMyProjects: (_, _action: PayloadAction<void>) => {},
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
