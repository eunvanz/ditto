import React from "react";
import ProjectManagementView from "./ProjectManagementView";
import { Redirect } from "react-router-dom";
import ROUTE from "../../paths";
import useProjectManagementViewProps from "./useProjectManagementViewProps";

const ProjectManagementContainer = () => {
  const { project, key } = useProjectManagementViewProps();

  return project ? (
    <ProjectManagementView project={project} key={key} />
  ) : (
    <Redirect to={ROUTE.ROOT} />
  );
};

export default ProjectManagementContainer;
