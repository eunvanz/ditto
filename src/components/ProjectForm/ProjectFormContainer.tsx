import React, { useCallback, useMemo } from "react";
import ProjectForm, { ProjectFormValues } from "./ProjectForm";
import { useDispatch, useSelector } from "react-redux";
import ProjectFormSelectors from "../../store/Project/ProjectSelectors";
import ProjectFormSlice from "../../store/Project/ProjectSlice";
import { RootState } from "../../store";

const ProjectFormContainer = () => {
  const dispatch = useDispatch();

  const isSubmitting = useSelector(
    ProjectFormSelectors.selectIsProjectFormSubmitting
  );
  const project = useSelector(
    (state: RootState) => state.ui.projectFormModal.project
  );

  const submitProjectForm = useCallback(
    (values: ProjectFormValues) => {
      dispatch(ProjectFormSlice.actions.submitProjectForm(values));
    },
    [dispatch]
  );

  const defaultValues = useMemo(() => {
    return project
      ? { title: project.title, description: project.description }
      : undefined;
  }, [project]);

  return (
    <ProjectForm
      onSubmit={submitProjectForm}
      isSubmitting={isSubmitting}
      defaultValues={defaultValues}
    />
  );
};

export default ProjectFormContainer;
