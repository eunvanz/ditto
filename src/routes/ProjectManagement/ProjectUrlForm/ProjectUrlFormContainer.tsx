import React, { useCallback, useEffect } from "react";
import ProjectUrlForm, { ProjectUrlFormValues } from "./ProjectUrlForm";
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { ProjectUrlDoc, ProjectDoc } from "../../../types";
import DataSelectors from "../../../store/Data/DataSelectors";
import { DATA_KEY } from "../../../store/Data/DataSlice";
import { UiActions } from "../../../store/Ui/UiSlice";

export interface ProjectUrlFormContainerProps {
  project: ProjectDoc;
}

const ProjectUrlFormContainer = ({ project }: ProjectUrlFormContainerProps) => {
  const dispatch = useDispatch();

  const submitProjectUrlForm = useCallback(
    (values: ProjectUrlFormValues) => {
      dispatch(ProjectActions.submitProjectUrlForm(values));
    },
    [dispatch]
  );

  const deleteProjectUrl = useCallback(
    (projectUrl: ProjectUrlDoc) => {
      dispatch(ProjectActions.deleteProjectUrl(projectUrl));
    },
    [dispatch]
  );

  const projectUrls = useSelector(
    DataSelectors.createRecordDataKeySelector({
      dataKey: DATA_KEY.PROJECT_URLS,
      recordKey: project.id,
    })
  );

  useEffect(() => {
    dispatch(ProjectActions.listenToProjectUrls());
    return () => {
      dispatch(ProjectActions.unlistenToProjectUrls());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!projectUrls) {
      dispatch(UiActions.showLoading());
    } else {
      dispatch(UiActions.hideLoading());
    }
  }, [dispatch, projectUrls]);

  return projectUrls ? (
    <ProjectUrlForm
      onSubmit={submitProjectUrlForm}
      onDelete={deleteProjectUrl}
      projectUrls={projectUrls as ProjectUrlDoc[]}
    />
  ) : null;
};

export default ProjectUrlFormContainer;
