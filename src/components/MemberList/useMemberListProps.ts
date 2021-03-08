import { MemberListContainerProps } from "./MemberListContainer";
import { useDispatch, useSelector } from "react-redux";
import useProjectByParam from "../../hooks/useProjectByParam";
import { useMemo, useCallback } from "react";
import { UserProfileDoc, MemberRole } from "../../types";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { getProjectKeyByRole } from "../../helpers/projectHelpers";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import useLoading from "../../hooks/useLoading";

const useMemberListProps = ({
  title,
  allMembers,
  hasAuthorization,
}: MemberListContainerProps) => {
  const dispatch = useDispatch();

  const { project } = useProjectByParam();

  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  const role = useMemo(() => {
    switch (title) {
      case "Owners":
        return "owner";
      case "Managers":
        return "manager";
      case "Guests":
        return "guest";
    }
  }, [title]);

  const members = useMemo(() => {
    if (!project) {
      return [];
    }
    return allMembers.filter(
      (member) => project[getProjectKeyByRole(role)][member.uid]
    );
  }, [allMembers, project, role]);

  const onClickMoveTo = useCallback(
    (member: UserProfileDoc, newRole: MemberRole) => {
      dispatch(
        ProjectActions.changeMemberRole({ member, newRole, oldRole: role })
      );
    },
    [dispatch, role]
  );

  const onClickDelete = useCallback(
    (member: UserProfileDoc, role: MemberRole) => {
      dispatch(ProjectActions.deleteMember({ member, role }));
    },
    [dispatch]
  );

  const onClickAdd = useCallback(
    (role: MemberRole) => {
      dispatch(UiActions.showSearchUserFormModal(role));
    },
    [dispatch]
  );

  useLoading(userProfile, "loadingUserProfile");

  return {
    title,
    members,
    hasAuthorization,
    onClickMoveTo,
    onClickDelete,
    onClickAdd,
    userProfile,
  };
};

export default useMemberListProps;
