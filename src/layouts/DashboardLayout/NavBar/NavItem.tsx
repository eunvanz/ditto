import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
} from "react";
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
  RootRef,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import SettingsIcon from "@material-ui/icons/Settings";
import FolderOutlined from "@material-ui/icons/FolderOutlined";
import AddIcon from "@material-ui/icons/Add";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import { Theme } from "../../../theme";
import { REQUEST_METHOD } from "../../../types";
import Label from "../../../components/Label";
import NewBadge from "../../../components/NewBadge";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import { getRequestMethodColor } from "../../../helpers/projectHelpers";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { DragIndicator } from "@material-ui/icons";

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
  isDeprecated?: boolean;
  hasNoAuth?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  draggableProps?: DraggableProvidedDraggableProps;
  index?: number;
  isDraggingOver?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: "block",
    paddingTop: 0,
    paddingBottom: 0,
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
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
    marginRight: theme.spacing(0.5),
  },
  handle: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    marginRight: "auto",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 190,
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
  draggingOver: {
    backgroundColor: theme.palette.background.dark,
  },
}));

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  (
    {
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
      isDeprecated,
      hasNoAuth,
      dragHandleProps,
      draggableProps,
      index,
      isDraggingOver,
      ...restProps
    },
    ref,
  ) => {
    if (type === "group") {
      assertNotEmpty(childrenCount);
    }

    const classes = useStyles();

    const [isOpen, setIsOpen] = useState<boolean>(isInitiallyOpen);

    useEffect(() => {
      if (isDraggingOver && !isOpen) {
        setIsOpen(true);
      }
    }, [isDraggingOver, isOpen]);

    useEffect(() => {
      // 데이터 로딩에 따라 뒤늦게 열리는 경우가 있어서 추가된 로직
      if (isInitiallyOpen) {
        setIsOpen(isInitiallyOpen);
      }
    }, [isInitiallyOpen]);

    const handleToggle = (): void => {
      setIsOpen((prevOpen) => !prevOpen);
    };

    let paddingLeft = 4;

    if (depth > 0) {
      paddingLeft = 8 + 4 * depth;
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

    const handleOnClickAddRequest = useCallback(() => {
      onClickAddRequest?.();
    }, [onClickAddRequest]);

    const handleOnClickAddGroup = useCallback(() => {
      onClickAddGroup?.();
    }, [onClickAddGroup]);

    const addNewItemButtonRef = useRef<HTMLDivElement>(null);

    if (["project", "group"].includes(type)) {
      return (
        <div {...draggableProps} ref={ref}>
          <ListItem
            className={clsx(
              classes.item,
              className,
              isDraggingOver ? classes.draggingOver : undefined,
            )}
            disableGutters
            key={title}
            {...restProps}
          >
            <Button className={classes.button} onClick={handleToggle} style={style}>
              <div
                {...dragHandleProps}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DragIndicator className={classes.handle} />
              </div>
              <Icon className={classes.icon} size="20" />
              <span className={clsx(classes.title, hasNew ? "has-new" : undefined)}>
                {title}
                {childrenCount ? (
                  <Chip className={classes.countChip} label={childrenCount} />
                ) : null}
              </span>
              {(type === "group" ? !hasNoAuth : true) && (
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
              )}
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
            <Collapse in={isOpen}>
              {children}
              {!hasNoAuth && (
                <>
                  <RootRef rootRef={addNewItemButtonRef}>
                    <NavItem
                      type="add"
                      depth={depth + 1}
                      title={depth === 0 ? "ADD NEW GROUP" : "ADD NEW OPERATION"}
                      onClick={
                        depth === 0 ? handleOnClickAddGroup : handleOnClickAddRequest
                      }
                    />
                  </RootRef>
                </>
              )}
            </Collapse>
          </ListItem>
        </div>
      );
    } else if (["request"].includes(type)) {
      return (
        <div {...draggableProps} ref={ref}>
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
              <div
                {...dragHandleProps}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DragIndicator className={classes.handle} />
              </div>
              {!!requestMethod && <RequestMethodBadge requestMethod={requestMethod} />}
              <NewBadge isVisible={hasNew} className={classes.newBadge}>
                <span className={classes.title}>
                  {isDeprecated ? <del>{title}</del> : title}
                </span>
              </NewBadge>
            </Button>
          </ListItem>
        </div>
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
  },
);

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
        return { color: getRequestMethodColor(requestMethod), text: "GET" };
      case REQUEST_METHOD.POST:
        return { color: getRequestMethodColor(requestMethod), text: "POST" };
      case REQUEST_METHOD.PUT:
        return { color: getRequestMethodColor(requestMethod), text: "PUT" };
      case REQUEST_METHOD.DELETE:
        return { color: getRequestMethodColor(requestMethod), text: "DEL" };
      case REQUEST_METHOD.PATCH:
        return { color: getRequestMethodColor(requestMethod), text: "PATCH" };
      default:
        return { color: "error" as const, text: "" };
    }
  }, [requestMethod]);

  // @ts-ignore
  return <RequestMethodLabel color={color}>{text}</RequestMethodLabel>;
};

export default NavItem;
