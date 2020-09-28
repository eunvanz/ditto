import React, { useCallback } from "react";
import ProjectBasicForm, { ProjectBasicFormValues } from "./ProjectBasicForm";
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import { ProjectDoc } from "../../../types";

export interface ProjectBasicFormContainerProps {
  project: ProjectDoc;
}

const ProjectBasicFormContainer: React.FC<ProjectBasicFormContainerProps> = ({
  project,
}) => {
  const dispatch = useDispatch();

  const isSubmitting = useSelector(
    ProjectSelectors.selectIsProjectFormSubmitting
  );

  const submitProjectForm = useCallback(
    (values: ProjectBasicFormValues) => {
      dispatch(
        ProjectActions.submitProjectForm({ data: values, type: "modify" })
      );
    },
    [dispatch]
  );

  const deleteProject = useCallback(() => {
    assertNotEmpty(project);
    dispatch(ProjectActions.deleteProject(project));
  }, [dispatch, project]);

  return (
    <ProjectBasicForm
      project={project}
      isSubmitting={isSubmitting}
      onSubmit={submitProjectForm}
      onDelete={deleteProject}
    />
  );
};

export default ProjectBasicFormContainer;
