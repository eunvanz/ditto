import { RootState } from "..";
import { ProjectActions } from "./ProjectSlice";

const selectIsSubmitting = (state: RootState) =>
  state.progress.includes(ProjectActions.submitProjectForm.type);

const ProjectFormSelectors = {
  selectIsSubmitting,
};

export default ProjectFormSelectors;
