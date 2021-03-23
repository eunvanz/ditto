import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FirebaseSelectors from "../store/Firebase/FirebaseSelectors";

const useProjectByParam = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const project = useSelector(
    FirebaseSelectors.createProjectSelectorByProjectId(projectId),
  );

  return { project, projectId };
};

export default useProjectByParam;
