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
import { checkHasAuthorization } from "../../helpers/projectHelpers";
import { Theme } from "../../theme";
import { UserProfileDoc, MemberRole } from "../../types";

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
    marginRight: theme.spacing(1),
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
  role: MemberRole;
  onClickMoveTo: (member: UserProfileDoc, memberRole: MemberRole) => void;
  onClickDelete: (member: UserProfileDoc, memberRole: MemberRole) => void;
  onClickAdd: (memberRole: MemberRole) => void;
  userProfile: UserProfileDoc;
}

const MemberList: React.FC<MemberListProps> = ({
  title,
  members,
  role,
  onClickMoveTo,
  onClickDelete,
  onClickAdd,
  userProfile,
}) => {
  const classes = useStyles();

  const hasAuthorization = useMemo(() => {
    if (title === "Owners") {
      return role === "owner";
    } else if (title === "Managers") {
      return ["owner", "manager"].includes(role);
    } else if (title === "Guests") {
      return ["owner", "manager"].includes(role);
    }
    return false;
  }, [role, title]);

  const memberRole = useMemo(() => {
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
          key={member.uid}
          member={member}
          hasAuthorization={userProfile.uid !== member.uid && hasAuthorization}
          role={role}
          memberRole={memberRole}
          onClickMoveTo={onClickMoveTo}
          onClickDelete={onClickDelete}
        />
      ))}
      {checkHasAuthorization(role, memberRole) && (
        <Box p={2} pt={0}>
          <Button
            className={classes.addButton}
            variant="outlined"
            color="secondary"
            fullWidth
            size="large"
            onClick={() => onClickAdd(memberRole)}
          >
            <Add /> ADD NEW MEMBERS
          </Button>
        </Box>
      )}
    </Card>
  );
};

export interface MemberItemProps
  extends Pick<MemberListProps, "onClickMoveTo" | "onClickDelete"> {
  member: UserProfileDoc;
  hasAuthorization: boolean;
  memberRole: MemberRole; // 이 그룹의 롤
  role: MemberRole; // 사용자의 롤
}

export const MemberItem: React.FC<MemberItemProps> = ({
  member,
  hasAuthorization,
  role,
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
        if (role === "manager") {
          return ["guest"];
        }
        return ["owner", "guest"];
      case "guest":
        if (role === "manager") {
          return ["manager"];
        }
        return ["owner", "manager"];
    }
  }, [memberRole, role]);

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
          <div>
            <Typography variant="h6" color="inherit">
              {member.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {member.email}
            </Typography>
          </div>
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
                <MenuItem key={item} onClick={() => onClickMoveTo(member, item)}>
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
