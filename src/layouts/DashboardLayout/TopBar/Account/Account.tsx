import React, { useRef, useState } from "react";
import { FC } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Hidden,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { User } from "../../../../types";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1),
  },
  popover: {
    width: 200,
  },
}));

export interface AccountProps {
  user?: User;
  onLogout: () => void;
  onClickLogin: () => void;
}

const Account: FC<AccountProps> = ({ user, onLogout, onClickLogin }) => {
  const classes = useStyles();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    if (user) {
      setOpen(true);
    } else {
      onClickLogin();
    }
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        // @ts-ignore
        ref={ref}
      >
        {user ? (
          <>
            <Avatar
              alt={user.auth.displayName || "User"}
              src={user.auth.photoURL || ""}
              className={classes.avatar}
            />
            <Hidden smDown>
              <Typography variant="h6" color="inherit">
                {user.auth.displayName}
              </Typography>
            </Hidden>
          </>
        ) : (
          <>Sign in</>
        )}
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        PaperProps={{ className: classes.popover }}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >
        <MenuItem
          onClick={() => {
            setOpen(false);
            onLogout();
          }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

export default Account;
