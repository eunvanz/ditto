import React from "react";
import MembersTab from "./MembersTab";
import useMembersTabProps from "./useMembersTabProps";

const MembersTabContainer = () => {
  const { allMembers, ...props } = useMembersTabProps();
  return allMembers ? <MembersTab allMembers={allMembers} {...props} /> : null;
};

export default MembersTabContainer;
