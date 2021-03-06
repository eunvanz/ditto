import React from "react";
import { Grid } from "@material-ui/core";
import MemberList from "../../../components/MemberList";
import SearchUserFormModal from "../../../components/SearchUserFormModal";
import { MemberRole, UserProfileDoc } from "../../../types";

export interface MembersTabProps {
  allMembers: UserProfileDoc[];
  role: MemberRole;
}

const MembersTab = ({ allMembers, role }: MembersTabProps) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4} sm={12}>
          <MemberList allMembers={allMembers} title="Owners" role={role} />
        </Grid>
        <Grid item md={4} sm={12}>
          <MemberList allMembers={allMembers} title="Managers" role={role} />
        </Grid>
        <Grid item md={4} sm={12}>
          <MemberList allMembers={allMembers} title="Guests" role={role} />
        </Grid>
        <SearchUserFormModal />
      </Grid>
    </>
  );
};

export default MembersTab;
