import { Divider, makeStyles } from "@material-ui/core";
import React from "react";
import { APP_VERSION } from "../../../constants";
import { Theme } from "../../../theme";

const useStyle = makeStyles((theme: Theme) => ({
  footerContent: {
    textAlign: "center",
    color: theme.palette.text.disabled,
    paddingTop: theme.spacing(3),
    fontSize: "0.825rem",
  },
  footerWrapper: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
}));

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const classes = useStyle();
  return (
    <div className={classes.footerWrapper}>
      <Divider />
      <div className={classes.footerContent}>
        © 2021 Diitto. All rights reserved. v.{APP_VERSION}
      </div>
    </div>
  );
};

export default Footer;
