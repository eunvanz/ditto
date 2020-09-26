import { RootState } from "..";
import { ProjectActions } from "./ProjectSlice";

const selectIsProjectFormSubmitting = (state: RootState) =>
  state.progress.includes(ProjectActions.submitProjectForm.type);

const ProjectSelectors = {
  selectIsProjectFormSubmitting,
};

export default ProjectSelectors;
