import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import ROUTE from "../../paths";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { GroupDoc, ProjectDoc } from "../../types";
import { SectionItem } from "./NavBar/NavBar";

const useDashboardLayoutProps = () => {
  const dispatch = useDispatch();

  const projects = useSelector(FirebaseSelectors.selectOrderedMyProjects);

  const firestoreQuery = useMemo(() => {
    const query: any[] = [];
    projects.forEach((project) => {
      query.push({
        collection: `projects/${project.id}/groups`,
        orderBy: ["createdAt", "asc"],
      });
      query.push({
        collection: `projects/${project.id}/requests`,
        orderBy: ["createdAt", "asc"],
      });
    });
    return query;
  }, [projects]);

  useFirestoreConnect(firestoreQuery);

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

  const groupedProjectRequests = useSelector(
    FirebaseSelectors.createGroupedProjectRequestsSelector(
      projects.map((project) => project.id)
    )
  );

  const getGroupSubItems = useCallback(
    (project: ProjectDoc, group: GroupDoc) => {
      return groupedProjectRequests[project.id]
        ?.filter((request) => request.groupId === group.id)
        .map((request) => ({
          title: request.name,
          type: "request" as const,
          hasNew: false,
          href: `${ROUTE.REQUESTS}/${request.id}`,
        }));
    },
    [groupedProjectRequests]
  );

  const getProjectSubItems = useCallback(
    (project: ProjectDoc) => {
      const subItems: SectionItem[] = [];
      groupedProjectGroups[project.id]?.forEach((group) => {
        const items = getGroupSubItems(project, group);
        subItems.push({
          title: group.name,
          type: "group" as const,
          hasNew: false,
          childrenCount: items?.length || 0,
          onClickConfig: () => showGroupFormModal(project, group),
          onClickAddRequest: () => showRequestFormModal(project, group),
          items,
        });
      });
      groupedProjectRequests[project.id]
        ?.filter((request) => !request.groupId)
        .forEach((request) => {
          subItems.push({
            title: request.name,
            type: "request" as const,
            hasNew: false,
            href: `${ROUTE.REQUESTS}/${request.id}`,
          });
        });
      return subItems;
    },
    [
      getGroupSubItems,
      groupedProjectGroups,
      groupedProjectRequests,
      showGroupFormModal,
      showRequestFormModal,
    ]
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
