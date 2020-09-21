import { RootState } from "..";
import ProjectFormSlice from "./ProjectFormSlice";

const selectIsSubmitting = (state: RootState) =>
  state.progress.includes(ProjectFormSlice.actions.submitProjectForm.type);

const ProjectFormSelectors = {
  selectIsSubmitting,
};

export default ProjectFormSelectors;
