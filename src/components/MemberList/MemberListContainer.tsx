import React from "react";
import { UserProfileDoc } from "../../types";
import MemberList, { MemberListProps } from "./MemberList";
import useMemberListProps from "./useMemberListProps";

export interface MemberListContainerProps
  extends Pick<MemberListProps, "title" | "role"> {
  allMembers: UserProfileDoc[];
}

const MemberListContainer = (containerProps: MemberListContainerProps) => {
  const { userProfile, ...props } = useMemberListProps(containerProps);
  return userProfile ? <MemberList userProfile={userProfile} {...props} /> : null;
};

export default MemberListContainer;
