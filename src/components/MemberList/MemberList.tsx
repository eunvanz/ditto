import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Chip,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { More } from "@material-ui/icons";
import React from "react";
import { Theme } from "../../theme";
import { UserProfileDoc } from "../../types";

const useStyles = makeStyles((theme: Theme) => ({
  countChip: {
    height: 18,
    marginLeft: 10,
    "&> span": {
      color: theme.palette.text.secondary,
      fontSize: "0.875rem",
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1),
  },
  moreButton: {},
}));

export interface MemberListProps {
  title: string;
  members: UserProfileDoc[];
  hasAuthorization: boolean;
}

const MemberList: React.FC<MemberListProps> = ({
  title,
  members,
  hasAuthorization,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        title={
          <>
            {title}
            {members?.length ? (
              <Chip className={classes.countChip} label={members.length} />
            ) : (
              ""
            )}
          </>
        }
      />
      {members.map((member) => (
        <MemberItem member={member} hasAuthorization={hasAuthorization} />
      ))}
    </Card>
  );
};

export interface MemberItemProps {
  member: UserProfileDoc;
  hasAuthorization: boolean;
}

export const MemberItem: React.FC<MemberItemProps> = ({
  member,
  hasAuthorization,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <Avatar
        alt={member.name}
        src={member.photoUrl || ""}
        className={classes.avatar}
      />
      <Typography variant="h6" color="inherit">
        {member.name}
      </Typography>
      <Button className={classes.moreButton}>
        <More fontSize="small" />
      </Button>
    </Card>
  );
};

export default MemberList;
