import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";
import { ProjectItem } from "../../types";

export type ProjectState = {
  myProjects?: ProjectItem[];
};

export const initialProjectState: ProjectState = {};

const ProjectSlice = createSlice({
  name: "Project",
  initialState: initialProjectState,
  reducers: {
    submitProjectForm: (_, _action: PayloadAction<ProjectFormValues>) => {},
    listenToMyProjects: (_, _action: PayloadAction<void>) => {},
    receiveMyProjects: (state, action: PayloadAction<ProjectItem[]>) => {
      state.myProjects = action.payload;
    },
    clearMyProjects: (state, _action: PayloadAction<void>) => {
      state.myProjects = undefined;
    },
  },
});

export const ProjectActions = ProjectSlice.actions;

export default ProjectSlice;
