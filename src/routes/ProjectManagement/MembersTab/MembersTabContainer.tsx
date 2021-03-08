import React from "react";
import MembersTab from "./MembersTab";
import useMembersTabProps from "./useMembersTabProps";

const MembersTabContainer = () => {
  const props = useMembersTabProps();
  return props.allMembers ? <MembersTab {...props} /> : null;
};

export default MembersTabContainer;
