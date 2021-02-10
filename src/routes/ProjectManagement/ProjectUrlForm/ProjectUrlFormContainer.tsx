import React from "react";
import ProjectUrlForm from "./ProjectUrlForm";
import useProjectUrlFormProps from "./useProjectUrlFormProps";

const ProjectUrlFormContainer = () => {
  const props = useProjectUrlFormProps();

  return <ProjectUrlForm {...props} />;
};

export default ProjectUrlFormContainer;
