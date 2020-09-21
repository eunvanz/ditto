import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";

export type ProjectFormState = {};

export const initialProjectFormState: ProjectFormState = {};

const ProjectFormSlice = createSlice({
  name: "ProjectForm",
  initialState: initialProjectFormState,
  reducers: {
    submitProjectForm: (_, _action: PayloadAction<ProjectFormValues>) => {},
  },
});

export default ProjectFormSlice;
