import React, { useEffect } from "react";
import { FC, ReactNode } from "react";
import { useLocation, matchPath } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import NavItem from "./NavItem";
import { REQUEST_METHOD } from "../../../types";

export interface NavBarProps {
  onMobileClose: () => void;
  isOpenMobile: boolean;
  sections: Section[];
}

interface Item {
  href?: string;
  icon?: ReactNode;
  info?: ReactNode;
  items?: Item[];
  requestMethod?: REQUEST_METHOD;
  hasNew?: boolean;
  childrenCount?: number;
  title: string;
  onClickConfig?: () => void;
  type: "request" | "project" | "group";
}

export interface Section {
  items: Item[];
  subheader: string;
}

function renderNavItems({
  items,
  pathname,
  depth = 0,
}: {
  items: Item[];
  pathname: string;
  depth?: number;
}) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc: any[], item: Item) =>
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
  item: Item;
  pathname: string;
  depth: number;
}) {
  const key = item.title + depth;

  if (item.items) {
    const isPathMatched = !!matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        key={key}
        isOpen={isPathMatched}
        title={item.title}
        hasNew={item.hasNew}
        childrenCount={item.childrenCount}
        onClickConfig={item.onClickConfig}
        type={item.type}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        key={key}
        title={item.title}
        requestMethod={item.requestMethod}
        hasNew={item.hasNew}
        type={item.type}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 320,
  },
  desktopDrawer: {
    width: 320,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar: FC<NavBarProps> = ({ onMobileClose, isOpenMobile, sections }) => {
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
