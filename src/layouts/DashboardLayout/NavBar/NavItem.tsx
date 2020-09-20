import React, { useState, useMemo, useCallback } from "react";
import { FC, ReactNode } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import {
  Button,
  Collapse,
  ListItem,
  makeStyles,
  styled,
  Chip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import SettingsIcon from "@material-ui/icons/Settings";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FolderOutlined from "@material-ui/icons/FolderOutlined";
import AddIcon from "@material-ui/icons/Add";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import { Theme } from "../../../theme";
import { REQUEST_METHOD } from "../../../types";
import Label from "../../../components/Label";
import NewBadge from "../../../components/NewBadge";
import { assertNotEmpty } from "../../../helpers/commonHelpers";

export interface NavItemProps {
  children?: ReactNode;
  className?: string;
  type: "request" | "project" | "group" | "add";
  depth: number;
  href?: string;
  isOpen?: boolean;
  requestMethod?: REQUEST_METHOD;
  hasNew?: boolean;
  childrenCount?: number;
  title?: string;
  onClickConfig?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: "block",
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemLeaf: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    padding: "4px 2px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
  },
  buttonLeaf: {
    color: theme.palette.text.secondary,
    padding: "4px 2px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightRegular,
    "&.depth-0": {
      "& $title": {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  },
  insideButton: {
    color: theme.palette.text.secondary,
    minWidth: 24,
  },
  icon: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: "auto",
    "&.has-new": {
      color: theme.palette.error.main,
    },
  },
  active: {
    color: theme.palette.secondary.main,
    "& $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& $icon": {
      color: theme.palette.secondary.main,
    },
  },
  countChip: {
    height: 18,
    marginLeft: 5,
    "&> span": {
      color: theme.palette.text.secondary,
      fontSize: "0.725rem",
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
  addNewChip: {
    color: theme.palette.text.disabled,
    cursor: "pointer",
    border: 0,
    "&> svg": {
      color: theme.palette.text.disabled,
    },
  },
}));

const NavItem: FC<NavItemProps> = ({
  children,
  className,
  depth,
  href,
  isOpen: isInitiallyOpen = false,
  title,
  requestMethod,
  hasNew = false,
  childrenCount,
  onClickConfig,
  type,
  ...restProps
}) => {
  if (type === "group") {
    assertNotEmpty(children);
    assertNotEmpty(childrenCount);
  } else if (type === "request") {
    assertNotEmpty(requestMethod);
  } else if (type === "project") {
    assertNotEmpty(children);
  }

  const classes = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(isInitiallyOpen);

  const handleToggle = (): void => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 16 + 8 * depth;
  }

  const style = { paddingLeft };

  const handleOnClickConfig = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onClickConfig?.();
    },
    [onClickConfig]
  );

  const Icon = useMemo(() => {
    switch (type) {
      case "project":
        return EmojiObjectsOutlinedIcon as any;
      case "group":
        return FolderOutlined;
      case "add":
        return AddIcon;
      default:
        return undefined;
    }
  }, [type]);

  if (["project", "group"].includes(type)) {
    return (
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        key={title}
        {...restProps}
      >
        <Button className={classes.button} onClick={handleToggle} style={style}>
          <Icon className={classes.icon} size="20" />
          <span className={clsx(classes.title, hasNew ? "has-new" : undefined)}>
            {title}
            {childrenCount ? (
              <Chip className={classes.countChip} label={childrenCount} />
            ) : null}
          </span>
          {onClickConfig && (
            <Button
              className={classes.insideButton}
              size="small"
              onClick={handleOnClickConfig}
            >
              <SettingsIcon fontSize="small" />
            </Button>
          )}
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={isOpen}>
          <NavItem type="add" depth={depth + 1} />
          {children}
        </Collapse>
      </ListItem>
    );
  } else if (["request"].includes(type)) {
    return (
      <ListItem
        className={clsx(classes.itemLeaf, className)}
        disableGutters
        key={title}
        {...restProps}
      >
        <Button
          activeClassName={classes.active}
          className={clsx(classes.buttonLeaf, `depth-${depth}`)}
          component={RouterLink}
          exact
          style={style}
          to={href!}
        >
          <RequestMethodBadge requestMethod={requestMethod!} />
          <NewBadge isVisible={hasNew} className={classes.title}>
            <span className={classes.title}>{title}</span>
          </NewBadge>
          <Button className={classes.insideButton} size="small">
            <MoreHorizIcon fontSize="small" />
          </Button>
        </Button>
      </ListItem>
    );
  } else if (["add"].includes(type)) {
    return (
      <ListItem
        className={clsx(classes.itemLeaf, className)}
        disableGutters
        key="add"
        {...restProps}
      >
        <Button
          className={clsx(classes.buttonLeaf, `depth-${depth}`)}
          style={style}
        >
          <Chip
            variant="outlined"
            className={classes.addNewChip}
            size="small"
            label="새 아이템 추가"
            icon={<Icon />}
          />
        </Button>
      </ListItem>
    );
  }
  return null;
};

export interface RequestMethodBadgeProps {
  requestMethod: REQUEST_METHOD;
}

const RequestMethodLabel = styled(Label)({
  marginRight: 5,
  fontSize: "0.5rem",
  padding: "0px 4px",
});

const RequestMethodBadge: FC<RequestMethodBadgeProps> = ({ requestMethod }) => {
  const { color, text } = useMemo(() => {
    switch (requestMethod) {
      case REQUEST_METHOD.GET:
        return { color: "success" as const, text: "GET" };
      case REQUEST_METHOD.POST:
        return { color: "warning" as const, text: "POST" };
      case REQUEST_METHOD.PUT:
        return { color: "secondary" as const, text: "PUT" };
      case REQUEST_METHOD.DELETE:
        return { color: "error" as const, text: "DEL" };
      case REQUEST_METHOD.PATCH:
        return { color: "primary" as const, text: "PATCH" };
    }
  }, [requestMethod]);

  return <RequestMethodLabel color={color}>{text}</RequestMethodLabel>;
};

export default NavItem;
