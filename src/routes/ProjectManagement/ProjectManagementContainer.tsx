import React from "react";
import ProjectManagementView from "./ProjectManagementView";
import useProjectManagementViewProps from "./useProjectManagementViewProps";
import NotFoundView from "../NotFound";

const ProjectManagementContainer = () => {
  const { project, ...restProps } = useProjectManagementViewProps();

  return project ? (
    <ProjectManagementView project={project} {...restProps} />
  ) : (
    <NotFoundView
      title="The project you are looking for isn't here"
      description="The project doesn't exist or might be deleted."
    />
  );
};

export default ProjectManagementContainer;
