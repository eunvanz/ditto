import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import { ProjectActions } from "../../store/Project/ProjectSlice";

const useProjectManagementViewProps = () => {
  useAuth({ isUserRequired: true });

  const dispatch = useDispatch();

  const { project, projectId } = useProjectByParam();

  useEffect(() => {
    if (project) {
      dispatch(ProjectActions.receiveCurrentProject(project));
    }
  }, [dispatch, project]);

  const role = useProjectRole(project);

  return { project, key: projectId, role };
};

export default useProjectManagementViewProps;
