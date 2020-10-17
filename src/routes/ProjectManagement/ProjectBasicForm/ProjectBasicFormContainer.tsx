import React, { useCallback } from "react";
import ProjectBasicForm, { ProjectBasicFormValues } from "./ProjectBasicForm";
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { assertNotEmpty } from "../../../helpers/commonHelpers";

const ProjectBasicFormContainer = () => {
  const dispatch = useDispatch();

  const { isSubmitting, project } = useSelector(
    ProjectSelectors.selectForProjectBasicForm
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

  return project ? (
    <ProjectBasicForm
      project={project}
      isSubmitting={isSubmitting}
      onSubmit={submitProjectForm}
      onDelete={deleteProject}
    />
  ) : null;
};

export default ProjectBasicFormContainer;
