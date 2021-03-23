import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import { getTrueKeys } from "../../../helpers/projectHelpers";
import useLoading from "../../../hooks/useLoading";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useProjectRole from "../../../hooks/useProjectRole";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";

const useMembersTabProps = () => {
  const { project, projectId } = useProjectByParam();
  assertNotEmpty(project);

  useFirestoreConnect([
    {
      collection: "users",
      where: [["uid", "in", getTrueKeys(project.members)]],
      orderBy: ["name", "asc"],
      storeAs: `projectMembers/${projectId}`,
    },
  ]);

  const allMembers = useSelector(
    FirebaseSelectors.createProjectMembersSelector(projectId),
  );

  useLoading(allMembers, "loadingMembers");

  const role = useProjectRole(project);

  return {
    allMembers,
    role,
  };
};

export default useMembersTabProps;
