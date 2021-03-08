import React from "react";
import { UserProfileDoc } from "../../../types";
import MemberList from "../../../components/MemberList";
import { Grid } from "@material-ui/core";

export interface MembersTabProps {
  allMembers: UserProfileDoc[];
  hasAuthorization: boolean;
}

const MembersTab = ({ allMembers, hasAuthorization }: MembersTabProps) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <MemberList
            allMembers={allMembers}
            title="Owners"
            hasAuthorization={hasAuthorization}
          />
        </Grid>
        <Grid item xs={4}>
          <MemberList
            allMembers={allMembers}
            title="Managers"
            hasAuthorization={hasAuthorization}
          />
        </Grid>
        <Grid item xs={4}>
          <MemberList
            allMembers={allMembers}
            title="Guests"
            hasAuthorization={hasAuthorization}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default MembersTab;
