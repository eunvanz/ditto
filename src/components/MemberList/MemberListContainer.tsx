import React from "react";
import MemberList, { MemberListProps } from "./MemberList";
import useMemberListProps from "./useMemberListProps";
import { UserProfileDoc } from "../../types";

export interface MemberListContainerProps
  extends Pick<MemberListProps, "title" | "hasAuthorization"> {
  allMembers: UserProfileDoc[];
}

const MemberListContainer = (containerProps: MemberListContainerProps) => {
  const props = useMemberListProps(containerProps);
  return <MemberList {...props} />;
};

export default MemberListContainer;
