import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Backdrop, CircularProgress, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((_: Theme) => ({
  backdrop: {
    zIndex: 9999,
  },
}));

const GlobalLoading = () => {
  const isLoading = useSelector((state: RootState) => state.ui.isLoading);

  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
};

export default GlobalLoading;
