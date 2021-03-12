import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useRef, useState } from "react";
import { Notifications as NotificationsIcon } from "@material-ui/icons";
import { NotificationDoc } from "../../../../types";
import NewBadge from "../../../../components/NewBadge";
import { Theme } from "../../../../theme";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    width: 320,
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

export interface NotificationsProps {
  notifications: NotificationDoc[];
  onClickMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onClickMarkAllAsRead,
  onMarkAsRead,
}) => {
  const classes = useStyles();

  const ref = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const openList = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeList = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" ref={ref} onClick={openList}>
          <NewBadge isVisible={notifications.length > 0}>
            <SvgIcon>
              <NotificationsIcon />
            </SvgIcon>
          </NewBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={closeList}
        open={isOpen}
      >
        <Box p={2}>
          <Typography variant="h5" color="textPrimary">
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box p={2}>
            <Typography variant="h6" color="textPrimary">
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification) => {
                return (
                  <ListItem
                    component={notification.link ? Link : "a"}
                    divider
                    key={notification.id}
                    to={notification.link}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <ListItemText
                      primary={notification.content}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        color: "textPrimary",
                      }}
                      secondary={notification.createdAt}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box p={1} display="flex" justifyContent="center">
              <Button size="small" onClick={onClickMarkAllAsRead}>
                Mark all as read
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default Notifications;
