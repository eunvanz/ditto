import React from "react";
import ProjectForm from "./ProjectForm";
import useProjectFormProps from "./useProjectFormProps";

const ProjectFormContainer = () => {
  const props = useProjectFormProps();

  return <ProjectForm {...props} />;
};

export default ProjectFormContainer;
