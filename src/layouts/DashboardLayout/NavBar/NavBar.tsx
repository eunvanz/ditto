import React, { useCallback, useEffect } from "react";
import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  DragDropContext,
  Draggable,
  DragStart,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import {
  Box,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core";
import NavItem, { NavItemProps } from "./NavItem";
import { SCREEN_MODE } from "../../../store/Ui/UiSlice";
import { getDroppableStyles } from "../../../helpers/projectHelpers";

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 300,
  },
  desktopDrawer: {
    width: 300,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

export interface NavBarProps {
  onMobileClose: () => void;
  isOpenMobile: boolean;
  sections: Section[];
  onClickAddNewProject: () => void;
  screenMode: SCREEN_MODE;
}

export interface SectionItem
  extends Omit<NavItemProps, "depth" | "children" | "onClick"> {
  icon?: ReactNode;
  info?: ReactNode;
  items?: SectionItem[];
  title: string;
  type: "request" | "project" | "group";
  isDeprecated?: boolean;
  projectId: string;
}

export interface Section {
  items: SectionItem[];
  subheader: string;
}

function renderNavItems({
  items,
  pathname,
  depth = 0,
  theme,
}: {
  items: SectionItem[];
  pathname: string;
  depth?: number;
  theme: Theme;
}) {
  const indexByType = {
    project: 0,
    group: 0,
    request: 0,
    add: 0,
  };
  return (
    <List disablePadding>
      {items.reduce((acc: ReactNode[], item: SectionItem) => {
        return reduceChildRoutes({
          acc,
          item,
          pathname,
          depth,
          index: indexByType[item.type]++,
          theme,
        });
      }, [])}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth,
  index,
  theme,
}: {
  acc: ReactNode[];
  item: SectionItem;
  pathname: string;
  depth: number;
  index: number;
  theme: Theme;
}) {
  const key = item.title + depth;
  if (item.items && item.type === "project") {
    acc.push(
      <Draggable draggableId={key} key={key} index={index}>
        {(dragProvided, dragSnapshot) => (
          <NavItem
            depth={depth}
            key={key}
            ref={dragProvided.innerRef}
            dragHandleProps={dragProvided.dragHandleProps}
            draggableProps={dragProvided.draggableProps}
            dragSnapshot={dragSnapshot}
            {...item}
          >
            <Droppable
              droppableId={`groupScope-${item.projectId}`}
              type={`groups-${item.projectId}`}
            >
              {(dropProvided, dropSnapshot) => (
                <div
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  style={getDroppableStyles(dropSnapshot, theme)}
                >
                  {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items!,
                    theme,
                  })}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </NavItem>
        )}
      </Draggable>,
    );
  } else if (item.items && item.type === "group") {
    acc.push(
      <Draggable draggableId={key} key={key} index={index}>
        {(dragProvided, dragSnapshot) => (
          <Droppable
            droppableId={`requestScope-${key}`}
            type={`requests-${item.projectId}`}
          >
            {(dropProvided, dropSnapshot) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                style={getDroppableStyles(dropSnapshot, theme)}
              >
                <NavItem
                  depth={depth}
                  key={key}
                  ref={dragProvided.innerRef}
                  dragHandleProps={dragProvided.dragHandleProps}
                  draggableProps={dragProvided.draggableProps}
                  dragSnapshot={dragSnapshot}
                  {...item}
                >
                  {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items!,
                    theme,
                  })}
                  {dropProvided.placeholder}
                </NavItem>
              </div>
            )}
          </Droppable>
        )}
      </Draggable>,
    );
  } else {
    acc.push(
      <Draggable draggableId={key} key={key} index={index}>
        {(dragProvided, dragSnapshot) => (
          <NavItem
            depth={depth}
            href={item.href}
            key={key}
            ref={dragProvided.innerRef}
            dragHandleProps={dragProvided.dragHandleProps}
            draggableProps={dragProvided.draggableProps}
            dragSnapshot={dragSnapshot}
            {...item}
          />
        )}
      </Draggable>,
    );
  }

  return acc;
}

const NavBar: FC<NavBarProps> = ({
  onMobileClose,
  isOpenMobile,
  sections,
  onClickAddNewProject,
  screenMode,
}) => {
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    if (isOpenMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleOnDragEnd = useCallback(
    (result: DropResult, provided: ResponderProvided) => {},
    [],
  );

  const handleOnDragStart = useCallback(
    (initial: DragStart, provided: ResponderProvided) => {},
    [],
  );

  const content = (
    <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
      <Box height="100%" display="flex" flexDirection="column">
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <Box p={2}>
            {sections.map((section) => (
              <List
                key={section.subheader}
                subheader={
                  <ListSubheader disableGutters disableSticky>
                    {section.subheader}
                  </ListSubheader>
                }
              >
                <Droppable droppableId="projectScope" type="project">
                  {(dropProvided, dropSnapshot) => (
                    <div
                      ref={dropProvided.innerRef}
                      {...dropProvided.droppableProps}
                      style={getDroppableStyles(dropSnapshot, theme)}
                    >
                      {renderNavItems({
                        items: section.items,
                        pathname: location.pathname,
                        theme,
                      })}
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
                <NavItem
                  type="add"
                  depth={0}
                  title="ADD NEW PROJECT"
                  onClick={onClickAddNewProject}
                />
              </List>
            ))}
          </Box>
        </PerfectScrollbar>
      </Box>
    </DragDropContext>
  );

  return (
    <>
      <Hidden
        lgUp={screenMode !== SCREEN_MODE.WIDE}
        xlUp={screenMode === SCREEN_MODE.WIDE}
      >
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={isOpenMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden
        mdDown={screenMode !== SCREEN_MODE.WIDE}
        lgDown={screenMode === SCREEN_MODE.WIDE}
      >
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
