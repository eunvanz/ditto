import useProjectByParam from "../../../hooks/useProjectByParam";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import useLoading from "../../../hooks/useLoading";
import useProjectRole from "../../../hooks/useProjectRole";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import { getTrueKeys } from "../../../helpers/projectHelpers";

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
