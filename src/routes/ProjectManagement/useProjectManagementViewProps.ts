import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxFirestoreQuerySetting, useFirestoreConnect } from "react-redux-firebase";
import { getTrueKeys } from "../../helpers/projectHelpers";
import useAuth from "../../hooks/useAuth";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";

const useProjectManagementViewProps = () => {
  useAuth({ isUserRequired: true });

  const dispatch = useDispatch();

  const { project, projectId } = useProjectByParam();

  const firestoreQuery = useMemo(() => {
    if (project) {
      return {
        collection: "users",
        where: [["uid", "in", getTrueKeys(project.members)]],
        orderBy: ["name", "asc"],
        storeAs: `projectMembers/${projectId}`,
      };
    } else {
      return {};
    }
  }, [project, projectId]);

  useFirestoreConnect(firestoreQuery as ReduxFirestoreQuerySetting);

  useEffect(() => {
    if (project) {
      dispatch(ProjectActions.receiveCurrentProject(project));
    }
  }, [dispatch, project]);

  const role = useProjectRole(project);

  const screenMode = useSelector(UiSelectors.selectScreenMode);

  return { project, key: projectId, role, screenMode };
};

export default useProjectManagementViewProps;
