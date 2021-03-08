import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Chip,
  makeStyles,
  Typography,
  Box,
  Divider,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { MoreHoriz, Add } from "@material-ui/icons";
import React, { useRef, useState, useMemo } from "react";
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
  memberName: {
    padding: 5,

    fontSize: "1rem",
  },
  outerBox: {
    justifyContent: "space-between",
  },
  moreButton: {},
  popover: {
    width: 200,
  },
  addButton: {},
}));

export interface MemberListProps {
  title: "Owners" | "Managers" | "Guests";
  members: UserProfileDoc[];
  hasAuthorization: boolean;
  onClickMoveTo: (member: UserProfileDoc, memberRole: MemberRole) => void;
  onClickDelete: (member: UserProfileDoc, memberRole: MemberRole) => void;
  onClickAdd: (memberRole: MemberRole) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  title,
  members,
  hasAuthorization,
  onClickMoveTo,
  onClickDelete,
  onClickAdd,
}) => {
  const classes = useStyles();

  const role = useMemo(() => {
    switch (title) {
      case "Owners":
        return "owner";
      case "Managers":
        return "manager";
      case "Guests":
        return "guest";
    }
  }, [title]);

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
        <MemberItem
          key={member.id}
          member={member}
          hasAuthorization={hasAuthorization}
          memberRole={role}
          onClickMoveTo={onClickMoveTo}
          onClickDelete={onClickDelete}
        />
      ))}
      <Box p={2} pt={0}>
        <Button
          className={classes.addButton}
          variant="outlined"
          color="secondary"
          fullWidth
          size="large"
          onClick={() => onClickAdd(role)}
        >
          <Add /> ADD NEW MEMBER
        </Button>
      </Box>
    </Card>
  );
};

export type MemberRole = "owner" | "manager" | "guest";

export interface MemberItemProps
  extends Pick<MemberListProps, "onClickMoveTo" | "onClickDelete"> {
  member: UserProfileDoc;
  hasAuthorization: boolean;
  memberRole: MemberRole;
}

export const MemberItem: React.FC<MemberItemProps> = ({
  member,
  hasAuthorization,
  memberRole,
  onClickMoveTo,
  onClickDelete,
}) => {
  const classes = useStyles();

  const moreRef = useRef<HTMLButtonElement>(null);

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const menuItems: MemberRole[] = useMemo(() => {
    switch (memberRole) {
      case "owner":
        return ["manager", "guest"];
      case "manager":
        return ["owner", "guest"];
      case "guest":
        return ["owner", "manager"];
    }
  }, [memberRole]);

  return (
    <>
      <Divider />
      <Box p={2} display="flex" className={classes.outerBox}>
        <Box display="flex">
          <Avatar
            alt={member.name}
            src={member.photoUrl || ""}
            className={classes.avatar}
          />
          <Typography
            variant="h6"
            color="inherit"
            className={classes.memberName}
          >
            {member.name}
          </Typography>
        </Box>
        {hasAuthorization && (
          <>
            <Button
              ref={moreRef}
              className={classes.moreButton}
              onClick={() => setIsMoreOpen(true)}
            >
              <MoreHoriz />
            </Button>
            <Menu
              onClose={() => setIsMoreOpen(false)}
              keepMounted
              PaperProps={{ className: classes.popover }}
              getContentAnchorEl={null}
              anchorEl={moreRef.current}
              open={isMoreOpen}
            >
              {menuItems.map((item) => (
                <MenuItem onClick={() => onClickMoveTo(member, item)}>
                  Move to {item}
                </MenuItem>
              ))}
              <MenuItem onClick={() => onClickDelete(member, memberRole)}>
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </>
  );
};

export default MemberList;
