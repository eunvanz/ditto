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
import { Theme } from "../../../theme";
import { REQUEST_METHOD } from "../../../types";
import Label from "../../../components/Label";
import NewBadge from "../../../components/NewBadge";
import { assertNotEmpty } from "../../../helpers/commonHelpers";

export interface NavItemProps {
  children?: ReactNode;
  className?: string;
  depth: number;
  href?: string;
  icon?: any;
  info?: any;
  isOpen?: boolean;
  requestMethod?: REQUEST_METHOD;
  hasNew?: boolean;
  childrenCount?: number;
  title: string;
  onClickConfig?: () => void;
  type?: "api" | "project" | "group";
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
    padding: "10px 8px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
  },
  buttonLeaf: {
    color: theme.palette.text.secondary,
    padding: "10px 8px",
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
  chip: {
    height: 18,
    marginLeft: 2,
    "&> span": {
      fontSize: "0.725rem",
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
}));

const NavItem: FC<NavItemProps> = ({
  children,
  className,
  depth,
  href,
  icon: Icon,
  info: Info,
  isOpen: isInitiallyOpen = false,
  title,
  requestMethod,
  hasNew = false,
  childrenCount,
  onClickConfig,
  type,
  ...restProps
}) => {
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

  if (type === "group") {
    assertNotEmpty(children);
    assertNotEmpty(childrenCount);
  } else if (type === "api") {
    assertNotEmpty(requestMethod);
  } else if (type === "project") {
    assertNotEmpty(children);
  }

  if (children) {
    return (
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        key={title}
        {...restProps}
      >
        <Button className={classes.button} onClick={handleToggle} style={style}>
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={clsx(classes.title, hasNew ? "has-new" : undefined)}>
            {title}{" "}
            {childrenCount ? (
              <Chip className={classes.chip} label={childrenCount} />
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
        <Collapse in={isOpen}>{children}</Collapse>
      </ListItem>
    );
  }

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
        {Icon && <Icon className={classes.icon} size="20" />}
        {requestMethod && <RequestMethodBadge requestMethod={requestMethod} />}
        <NewBadge isVisible={hasNew} className={classes.title}>
          <span className={classes.title}>{title}</span>
        </NewBadge>
        <Button className={classes.insideButton} size="small">
          <MoreHorizIcon fontSize="small" />
        </Button>
        {Info && <Info />}
      </Button>
    </ListItem>
  );
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
