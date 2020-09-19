import React, { useState, useMemo } from "react";
import { FC, ReactNode } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import {
  Button,
  Collapse,
  ListItem,
  makeStyles,
  styled,
  Badge,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { Theme } from "../../../theme";
import { REQUEST_METHOD } from "../../../types";
import Label from "../../../components/Label";

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
  title: string;
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
}));

const NavItem: FC<NavItemProps> = ({
  children,
  className,
  depth,
  href,
  icon: Icon,
  info: Info,
  isOpen: initialIsOpen = false,
  title,
  requestMethod,
  hasNew,
  ...restProps
}) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen);

  const handleToggle = (): void => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 16 + 8 * depth;
  }

  const style = { paddingLeft };

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
            {title}
          </span>
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
        <Badge color="error" invisible={!hasNew} variant="dot">
          <span className={classes.title}>{title}</span>
        </Badge>
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
        return { color: "secondary" as const, text: "POST" };
      case REQUEST_METHOD.PUT:
        return { color: "warning" as const, text: "PUT" };
      case REQUEST_METHOD.DELETE:
        return { color: "error" as const, text: "DEL" };
      case REQUEST_METHOD.PATCH:
        return { color: "primary" as const, text: "PATCH" };
    }
  }, [requestMethod]);

  return <RequestMethodLabel color={color}>{text}</RequestMethodLabel>;
};

export default NavItem;
