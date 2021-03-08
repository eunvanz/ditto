import { useMemo } from "react";
import { useSelector } from "react-redux";
import FirebaseSelectors from "../store/Firebase/FirebaseSelectors";
import { MemberRole, ProjectDoc } from "../types";

const useProjectRole = (project?: ProjectDoc) => {
  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  const role: MemberRole = useMemo(() => {
    const { uid } = userProfile;
    if (project?.owners[uid]) {
      return "owner";
    } else if (project?.managers[uid]) {
      return "manager";
    } else {
      return "guest";
    }
  }, [project, userProfile]);

  return role;
};

export default useProjectRole;
