import React, { useMemo, useEffect } from "react";
import ProjectManagementView from "./ProjectManagementView";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { DATA_KEY, DataActions } from "../../store/Data/DataSlice";
import { useParams, Redirect } from "react-router-dom";
import ROUTE from "../../paths";

const ProjectManagementContainer = () => {
  const projects = useSelector(
    (state: RootState) => state.data[DATA_KEY.PROJECTS] || []
  );

  const { projectId } = useParams<{ projectId: string }>();

  const project = useMemo(() => {
    return projects.find((project) => project.id === projectId);
  }, [projectId, projects]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      dispatch(
        DataActions.receiveData({ key: DATA_KEY.PROJECT, data: project })
      );
    }
  }, [dispatch, project]);

  return project ? (
    <ProjectManagementView project={project} key={projectId} />
  ) : (
    <Redirect to={ROUTE.ROOT} />
  );
};

export default ProjectManagementContainer;
