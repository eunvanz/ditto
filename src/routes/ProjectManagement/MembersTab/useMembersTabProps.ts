import useProjectByParam from "../../../hooks/useProjectByParam";
import { useMemo } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import useLoading from "../../../hooks/useLoading";
import useProjectRole from "../../../hooks/useProjectRole";

const useMembersTabProps = () => {
  const { project, projectId } = useProjectByParam();

  const allMemberIds = useMemo(() => {
    if (project) {
      const memberIds = Object.keys(project?.members);
      return memberIds.filter((id) => project.members[id]);
    } else {
      return [];
    }
  }, [project]);

  useFirestoreConnect([
    {
      collection: "users",
      where: [["uid", "in", allMemberIds]],
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
