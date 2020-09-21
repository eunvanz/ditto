import React, { useCallback } from "react";
import ProjectForm, { ProjectFormValues } from "./ProjectForm";
import { useDispatch, useSelector } from "react-redux";
import ProjectFormSelectors from "../../store/ProjectForm/ProjectFormSelectors";
import ProjectFormSlice from "../../store/ProjectForm/ProjectFormSlice";

const ProjectFormContainer = () => {
  const dispatch = useDispatch();

  const isSubmitting = useSelector(ProjectFormSelectors.selectIsSubmitting);

  const submitProjectForm = useCallback(
    (values: ProjectFormValues) => {
      dispatch(ProjectFormSlice.actions.submitProjectForm(values));
    },
    [dispatch]
  );

  return (
    <ProjectForm onSubmit={submitProjectForm} isSubmitting={isSubmitting} />
  );
};

export default ProjectFormContainer;
