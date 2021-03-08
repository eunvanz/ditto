import React from "react";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon,
  Switch,
} from "@material-ui/core";
import { Menu as MenuIcon } from "react-feather";
import { THEMES } from "../../../types";
import { Theme } from "../../../theme";
import Account from "./Account";

export interface TopBarProps {
  className?: string;
  onMobileNavOpen?: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...(theme.name === THEMES.LIGHT
      ? {
          boxShadow: "none",
          backgroundColor: theme.palette.primary.main,
        }
      : {}),
    ...(theme.name === THEMES.DARK
      ? {
          backgroundColor: theme.palette.background.default,
        }
      : {}),
  },
  toolbar: {
    minHeight: 64,
  },
  logo: {
    fontFamily: "'Leckerli One', cursive",
    color: theme.name === THEMES.LIGHT ? "#fff" : theme.palette.text.primary,
    textDecoration: "unset",
    fontSize: "x-large",
  },
}));

const TopBar: FC<TopBarProps> = ({
  className,
  onMobileNavOpen,
  onToggleDarkMode,
  isDarkMode,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <RouterLink to="/" className={classes.logo}>
            diitto
          </RouterLink>
        </Hidden>
        <Box ml={2} flexGrow={1} />
        <Switch
          checked={isDarkMode}
          onChange={onToggleDarkMode}
          color="secondary"
        />
        <Box ml={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {},
};

export default TopBar;
