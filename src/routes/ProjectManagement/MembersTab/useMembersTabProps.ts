import useProjectByParam from "../../../hooks/useProjectByParam";
import { useMemo } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import AuthSelectors from "../../../store/Auth/AuthSelector";
import useLoading from "../../../hooks/useLoading";

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

  const auth = useSelector(AuthSelectors.selectAuth);

  const hasAuthorization = useMemo(() => {
    return !!project?.owners[auth.uid];
  }, [auth.uid, project]);

  useLoading(allMembers, "loadingMembers");

  return {
    allMembers,
    hasAuthorization,
  };
};

export default useMembersTabProps;
