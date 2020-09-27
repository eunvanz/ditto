import React, { useMemo, useCallback } from "react";
import DashboardLayout from "./DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { DATA_KEY } from "../../store/Data/DataSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { ProjectDoc } from "../../types";
import { ProjectActions } from "../../store/Project/ProjectSlice";

export interface DashboardLayoutContainerProps {
  children: React.ReactNode;
}

const DashboardLayoutContainer = ({
  children,
}: DashboardLayoutContainerProps) => {
  const dispatch = useDispatch();

  const projects = useSelector(
    (state: RootState) => state.data[DATA_KEY.PROJECTS]
  );

  const showProjectFormModal = useCallback(
    (project: ProjectDoc) => {
      dispatch(UiActions.showProjectFormModal(project));
    },
    [dispatch]
  );

  const deleteProject = useCallback(
    (project: ProjectDoc) => {
      dispatch(ProjectActions.deleteProject(project));
    },
    [dispatch]
  );

  const sections = useMemo(() => {
    return [
      {
        subheader: "내 프로젝트",
        items:
          projects?.map((project) => ({
            title: project.title,
            hasNew: false,
            childrenCount: 0,
            onClickEdit: () => showProjectFormModal(project),
            onClickDelete: () => deleteProject(project),
            type: "project" as const,
            items: undefined,
          })) || [],
      },
    ];
  }, [deleteProject, projects, showProjectFormModal]);

  return <DashboardLayout sections={sections}>{children}</DashboardLayout>;
};

export default DashboardLayoutContainer;
