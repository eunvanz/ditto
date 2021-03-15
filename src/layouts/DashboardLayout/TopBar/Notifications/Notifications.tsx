import {
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Check, Notifications as NotificationsIcon } from "@material-ui/icons";
import { formatDistance } from "date-fns";
import { NotificationDoc } from "../../../../types";
import { Theme } from "../../../../theme";
import { convertTimestampToDate } from "../../../../helpers/projectHelpers";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    width: 360,
  },
  link: {
    color: theme.palette.text.hint,
    "& :hover": {
      color: theme.palette.text.primary,
    },
  },
  time: {
    color: theme.palette.text.disabled,
  },
  newBadge: {
    "& .MuiBadge-badge": {
      height: 16,
      padding: "0 4px",
      fontSize: "0.7rem",
      minWidth: 16,
    },
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

  const now = useMemo(() => {
    return new Date();
  }, []);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" ref={ref} onClick={openList}>
          <Badge
            className={classes.newBadge}
            badgeContent={notifications.length}
            color="error"
          >
            <SvgIcon>
              <NotificationsIcon />
            </SvgIcon>
          </Badge>
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
                    divider
                    key={notification.id}
                    component={notification.link ? Link : "div"}
                    to={notification.link}
                    onClick={closeList}
                  >
                    <ListItemText
                      primary={<>{notification.title}</>}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        color: "textPrimary",
                      }}
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            dangerouslySetInnerHTML={{
                              __html: notification.content
                                .replace(
                                  /\{/g,
                                  '<span class="MuiTypography-colorPrimary">'
                                )
                                .replace(/\}/g, "</span>"),
                            }}
                          />
                          {notification.createdAt && (
                            <Typography
                              variant="caption"
                              component="div"
                              className={classes.time}
                            >
                              {formatDistance(
                                convertTimestampToDate(notification.createdAt),
                                now
                              )}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
            <Box p={1} display="flex" justifyContent="center">
              <Button size="small" onClick={onClickMarkAllAsRead}>
                Mark all as checked
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default Notifications;
