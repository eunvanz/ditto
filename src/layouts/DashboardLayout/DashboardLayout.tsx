import React, { useState } from "react";
import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { Theme } from "../../theme";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import { Section } from "./NavBar/NavBar";
import { SCREEN_MODE } from "../../store/Ui/UiSlice";
import Footer from "./Footer";

export interface DashboardLayoutProps {
  children?: ReactNode;
  sections: Section[];
  screenMode: SCREEN_MODE;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 300,
    },
    "&.wide": {
      [theme.breakpoints.down("lg")]: {
        paddingLeft: 0,
      },
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    minHeight: "calc(100vh - 64px)",
    overflow: "auto",
  },
  children: {
    minHeight: "calc(100% - 113px)",
  },
}));

const DashboardLayout: FC<DashboardLayoutProps> = ({
  sections,
  children,
  screenMode,
}) => {
  const classes = useStyles();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setIsMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setIsMobileNavOpen(false)}
        isOpenMobile={isMobileNavOpen}
        sections={sections}
      />
      <div
        className={clsx(
          classes.wrapper,
          screenMode === SCREEN_MODE.WIDE ? "wide" : undefined
        )}
      >
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <div className={classes.children}>{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
