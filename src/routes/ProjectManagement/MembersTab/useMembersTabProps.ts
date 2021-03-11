import useProjectByParam from "../../../hooks/useProjectByParam";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import useLoading from "../../../hooks/useLoading";
import useProjectRole from "../../../hooks/useProjectRole";

const useMembersTabProps = () => {
  const { project, projectId } = useProjectByParam();

  useFirestoreConnect([
    {
      collection: "users",
      where: [[`projects.${projectId}`, "==", true]],
      orderBy: ["name", "asc"],
      storeAs: `projectMembers/${projectId}`,
    },
  ]);

  const allMembers = useSelector(
    FirebaseSelectors.createProjectMembersSelector(projectId)
  );

  useLoading(allMembers, "loadingMembers");

  const role = useProjectRole(project);

  return {
    allMembers,
    role,
  };
};

export default useMembersTabProps;
