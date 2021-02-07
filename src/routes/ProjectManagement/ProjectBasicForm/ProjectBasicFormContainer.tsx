import React from "react";
import ProjectBasicForm from "./ProjectBasicForm";
import useProjectBasicFormProps from "./useProjectBasicFormProps";

const ProjectBasicFormContainer = () => {
  const props = useProjectBasicFormProps();

  return <ProjectBasicForm {...props} />;
};

export default ProjectBasicFormContainer;
