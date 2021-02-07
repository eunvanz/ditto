import React from "react";
import ProjectUrlForm from "./ProjectUrlForm";
import useProjectUrlFormProps from "./useProjectUrlFormProps";

const ProjectUrlFormContainer = () => {
  const props = useProjectUrlFormProps();

  return props.projectUrls ? <ProjectUrlForm {...props} /> : null;
};

export default ProjectUrlFormContainer;
