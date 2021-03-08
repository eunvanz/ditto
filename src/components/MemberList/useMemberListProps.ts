import { MemberListContainerProps } from "./MemberListContainer";
import { useDispatch } from "react-redux";
import useProjectByParam from "../../hooks/useProjectByParam";
import { useMemo, useCallback } from "react";
import { UserProfileDoc, MemberRole } from "../../types";
import { ProjectActions } from "../../store/Project/ProjectSlice";

const useMemberListProps = ({
  title,
  allMembers,
  hasAuthorization,
}: MemberListContainerProps) => {
  const dispatch = useDispatch();

  const { project } = useProjectByParam();

  const members = useMemo(() => {
    if (!project) {
      return [];
    }
    const role =
      title === "Owners"
        ? "owners"
        : title === "Managers"
        ? "managers"
        : "guests";
    return allMembers.filter((member) => project[role][member.id]);
  }, [allMembers, project, title]);

  const onClickMoveTo = useCallback(
    (member: UserProfileDoc, role: MemberRole) => {
      dispatch(ProjectActions.changeMemberRole({ member, role }));
    },
    [dispatch]
  );

  const onClickDelete = useCallback(
    (member: UserProfileDoc, role: MemberRole) => {
      dispatch(ProjectActions.deleteMember({ member, role }));
    },
    [dispatch]
  );

  const onClickAdd = useCallback((role: MemberRole) => {
    // TODO
  }, []);

  return {
    title,
    members,
    hasAuthorization,
    onClickMoveTo,
    onClickDelete,
    onClickAdd,
  };
};

export default useMemberListProps;
