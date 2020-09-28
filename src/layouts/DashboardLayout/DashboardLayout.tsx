import React, { useState } from "react";
import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { Theme } from "../../theme";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import { Section } from "./NavBar/NavBar";

export interface DashboardLayoutProps {
  children?: ReactNode;
  sections: Section[];
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
      paddingLeft: 320,
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
    minHeight: "100vh",
    overflow: "auto",
  },
}));

const DashboardLayout: FC<DashboardLayoutProps> = ({ sections, children }) => {
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
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
