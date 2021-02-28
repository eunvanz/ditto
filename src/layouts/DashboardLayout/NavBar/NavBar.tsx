import React, { useEffect } from "react";
import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import NavItem, { NavItemProps } from "./NavItem";

export interface NavBarProps {
  onMobileClose: () => void;
  isOpenMobile: boolean;
  sections: Section[];
  onClickAddNewProject: () => void;
}

export interface SectionItem
  extends Omit<NavItemProps, "depth" | "children" | "onClick"> {
  icon?: ReactNode;
  info?: ReactNode;
  items?: SectionItem[];
  title: string;
  type: "request" | "project" | "group";
}

export interface Section {
  items: SectionItem[];
  subheader: string;
}

function renderNavItems({
  items,
  pathname,
  depth = 0,
}: {
  items: SectionItem[];
  pathname: string;
  depth?: number;
}) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc: any[], item: SectionItem) =>
          reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth,
}: {
  acc: any[];
  item: SectionItem;
  pathname: string;
  depth: number;
}) {
  const key = item.title + depth;

  if (item.items) {
    acc.push(
      <NavItem depth={depth} key={key} {...item}>
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(<NavItem depth={depth} href={item.href} key={key} {...item} />);
  }

  return acc;
}

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

const NavBar: FC<NavBarProps> = ({
  onMobileClose,
  isOpenMobile,
  sections,
  onClickAddNewProject,
}) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (isOpenMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
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
              {renderNavItems({
                items: section.items,
                pathname: location.pathname,
              })}
              <NavItem
                type="add"
                depth={0}
                title="Add New Project"
                onClick={onClickAddNewProject}
              />
            </List>
          ))}
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
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
      <Hidden mdDown>
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
