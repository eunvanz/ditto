import React from "react";
import MemberList, { MemberListProps } from "./MemberList";
import useMemberListProps from "./useMemberListProps";
import { UserProfileDoc } from "../../types";

export interface MemberListContainerProps
  extends Pick<MemberListProps, "title" | "role"> {
  allMembers: UserProfileDoc[];
}

const MemberListContainer = (containerProps: MemberListContainerProps) => {
  const { userProfile, ...props } = useMemberListProps(containerProps);
  return userProfile ? <MemberList userProfile={userProfile} {...props} /> : null;
};

export default MemberListContainer;
