import React, { useState, useMemo, useCallback, useRef } from "react";
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
  Menu,
  MenuItem,
  RootRef,
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
  onClickAddGroup?: () => void;
  onClickAddRequest?: () => void;
  onClick?: () => void;
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
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 160,
    "&.has-new": {
      color: theme.palette.error.main,
    },
  },
  newBadge: {
    marginRight: "auto",
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
  configMenu: {
    "& li": {
      fontSize: "0.85rem",
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
  onClickAddGroup,
  onClickAddRequest,
  onClick,
  type,
  ...restProps
}) => {
  if (type === "group") {
    assertNotEmpty(childrenCount);
  } else if (type === "request") {
    assertNotEmpty(requestMethod);
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

  const [isNewItemMenuOpen, setIsNewItemMenuOpen] = useState(false);

  const handleOnClickNewItem = useCallback(() => {
    if (type === "project") {
      setIsNewItemMenuOpen(true);
    } else {
      onClickAddRequest?.();
    }
  }, [onClickAddRequest, type]);

  const handleOnClickAddRequest = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      e.stopPropagation();
      onClickAddRequest?.();
      setIsNewItemMenuOpen(false);
    },
    [onClickAddRequest]
  );

  const handleOnClickAddGroup = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      e.stopPropagation();
      onClickAddGroup?.();
      setIsNewItemMenuOpen(false);
    },
    [onClickAddGroup]
  );

  const addNewItemButtonRef = useRef<HTMLDivElement>(null);

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
          <Button
            className={classes.insideButton}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClickConfig?.();
            }}
          >
            <SettingsIcon fontSize="small" />
          </Button>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={isOpen}>
          {children}
          <RootRef rootRef={addNewItemButtonRef}>
            <NavItem
              type="add"
              depth={depth + 1}
              title={
                depth === 0
                  ? "새로운 그룹 또는 리퀘스트 추가"
                  : "새로운 리퀘스트 추가"
              }
              onClick={handleOnClickNewItem}
            />
          </RootRef>
          {type === "project" && (
            <Menu
              className={classes.configMenu}
              keepMounted
              open={isNewItemMenuOpen}
              onClose={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation();
                setIsNewItemMenuOpen(false);
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: 45,
              }}
              anchorEl={addNewItemButtonRef.current}
              getContentAnchorEl={null}
            >
              <MenuItem onClick={handleOnClickAddGroup}>그룹</MenuItem>
              <MenuItem onClick={handleOnClickAddRequest}>리퀘스트</MenuItem>
            </Menu>
          )}
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
          <NewBadge isVisible={hasNew} className={classes.newBadge}>
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
          onClick={onClick}
        >
          <Chip
            variant="outlined"
            className={classes.addNewChip}
            size="small"
            label={title}
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
        return { color: "primary" as const, text: "PUT" };
      case REQUEST_METHOD.DELETE:
        return { color: "error" as const, text: "DEL" };
      case REQUEST_METHOD.PATCH:
        return { color: "secondary" as const, text: "PATCH" };
    }
  }, [requestMethod]);

  return <RequestMethodLabel color={color}>{text}</RequestMethodLabel>;
};

export default NavItem;
