import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";
import { ProjectDoc } from "../../types";

export type ProjectState = {};

export const initialProjectState: ProjectState = {};

const ProjectSlice = createSlice({
  name: "Project",
  initialState: initialProjectState,
  reducers: {
    submitProjectForm: (_, _action: PayloadAction<ProjectFormValues>) => {},
    listenToMyProjects: (_, _action: PayloadAction<void>) => {},
    deleteProject: (_, _action: PayloadAction<ProjectDoc>) => {},
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
