import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import ROUTE from "../../paths";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { GroupDoc, ProjectDoc } from "../../types";

const useDashboardLayoutProps = () => {
  const dispatch = useDispatch();

  const projects = useSelector(FirebaseSelectors.selectOrderedMyProjects);

  const firestoreQuery = useMemo(() => {
    return projects.map((project) => ({
      collection: `projects/${project.id}/groups`,
      orderBy: ["createdAt", "asc"],
    }));
  }, [projects]);

  useFirestoreConnect(firestoreQuery as any);

  const history = useHistory();

  const showRequestFormModal = useCallback(
    (project: ProjectDoc, group?: any) => {
      dispatch(
        UiActions.showRequestFormModal({
          projectId: project.id,
          groupId: group?.id,
        })
      );
    },
    [dispatch]
  );

  const showGroupFormModal = useCallback(
    (project: ProjectDoc, group?: GroupDoc) => {
      dispatch(ProjectActions.receiveCurrentProject(project));
      dispatch(UiActions.showGroupFormModal(group));
    },
    [dispatch]
  );

  const groupedProjectGroups = useSelector(
    FirebaseSelectors.createGroupedProjectGroupsSelector(
      projects.map((project) => project.id)
    )
  );

  const getProjectSubItems = useCallback(
    (project: ProjectDoc) => {
      return groupedProjectGroups[project.id]?.map((group) => ({
        title: group.name,
        type: "group" as const,
        hasNew: false,
        childrenCount: 0,
        onClickConfig: () => showGroupFormModal(project, group),
        onClickAddRequest: () => showRequestFormModal(project, group),
        items: [],
      }));
    },
    [groupedProjectGroups, showGroupFormModal, showRequestFormModal]
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
            onClickConfig: () =>
              history.push(`${ROUTE.PROJECTS}/${project.id}`),
            onClickAddRequest: () => showRequestFormModal(project),
            onClickAddGroup: () => showGroupFormModal(project),
            type: "project" as const,
            items: getProjectSubItems(project),
          })) || [],
      },
    ];
  }, [
    getProjectSubItems,
    history,
    showRequestFormModal,
    projects,
    showGroupFormModal,
  ]);

  return { sections };
};

export default useDashboardLayoutProps;
