import React, { useMemo, useCallback } from "react";
import DashboardLayout from "./DashboardLayout";
import { useSelector } from "react-redux";
import { ProjectDoc } from "../../types";
import { useHistory } from "react-router-dom";
import ROUTE from "../../paths";
import FirebaseSelector from "../../store/Firebase/FirebaseSelector";

export interface DashboardLayoutContainerProps {
  children: React.ReactNode;
}

const DashboardLayoutContainer = ({
  children,
}: DashboardLayoutContainerProps) => {
  const projects = useSelector(FirebaseSelector.selectOrderedMyProjects);

  const history = useHistory();

  const navigateToNewRequest = useCallback(
    (project: ProjectDoc, group?: any) => {},
    []
  );

  const showGroupFormModal = useCallback((project: ProjectDoc) => {}, []);

  const sections = useMemo(() => {
    return [
      {
        subheader: "내 프로젝트",
        items:
          projects?.map((project) => ({
            title: project.title,
            hasNew: false,
            childrenCount: 0,
            onClickConfig: () =>
              history.push(`${ROUTE.PROJECTS}/${project.id}`),
            onClickAddRequest: () => navigateToNewRequest(project),
            onClickAddGroup: () => showGroupFormModal(project),
            type: "project" as const,
            items: undefined,
          })) || [],
      },
    ];
  }, [history, navigateToNewRequest, projects, showGroupFormModal]);

  return <DashboardLayout sections={sections}>{children}</DashboardLayout>;
};

export default DashboardLayoutContainer;
