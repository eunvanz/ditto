import React, { useCallback } from "react";
import ProjectUrlForm, { ProjectUrlFormValues } from "./ProjectUrlForm";
import { useDispatch } from "react-redux";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { ProjectUrlDoc } from "../../../types";

const ProjectUrlFormContainer = () => {
  const dispatch = useDispatch();

  const submitProjectUrlForm = useCallback(
    (values: ProjectUrlFormValues) => {
      dispatch(
        ProjectActions.submitProjectUrlForm({
          data: values,
        })
      );
    },
    [dispatch]
  );

  const deleteProjectUrl = useCallback((projectUrl: ProjectUrlDoc) => {}, []);

  return (
    <ProjectUrlForm
      onSubmit={submitProjectUrlForm}
      onDelete={deleteProjectUrl}
    />
  );
};

export default ProjectUrlFormContainer;
