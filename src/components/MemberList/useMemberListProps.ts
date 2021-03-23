import { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectKeyByRole } from "../../helpers/projectHelpers";
import useLoading from "../../hooks/useLoading";
import useProjectByParam from "../../hooks/useProjectByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { UserProfileDoc, MemberRole } from "../../types";
import { MemberListContainerProps } from "./MemberListContainer";

const useMemberListProps = ({ title, allMembers, role }: MemberListContainerProps) => {
  const dispatch = useDispatch();

  const { project } = useProjectByParam();

  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  const listRole = useMemo(() => {
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
      (member) => project[getProjectKeyByRole(listRole)][member.uid],
    );
  }, [allMembers, project, listRole]);

  const onClickMoveTo = useCallback(
    (member: UserProfileDoc, newRole: MemberRole) => {
      dispatch(ProjectActions.changeMemberRole({ member, newRole, oldRole: listRole }));
    },
    [dispatch, listRole],
  );

  const onClickDelete = useCallback(
    (member: UserProfileDoc, listRole: MemberRole) => {
      dispatch(ProjectActions.deleteMember({ member, role: listRole }));
    },
    [dispatch],
  );

  const onClickAdd = useCallback(
    (listRole: MemberRole) => {
      dispatch(UiActions.showSearchUserFormModal(listRole));
    },
    [dispatch],
  );

  useLoading(userProfile, "loadingUserProfile");

  return {
    title,
    members,
    role,
    onClickMoveTo,
    onClickDelete,
    onClickAdd,
    userProfile,
  };
};

export default useMemberListProps;
