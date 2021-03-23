import React, { FC } from "react";
import { Typography, makeStyles, Box } from "@material-ui/core";
import clsx from "clsx";

interface HeaderProps {
  className?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const Header: FC<HeaderProps> = ({ className, title, description, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Typography variant="h3" color="textPrimary">
        {title}
      </Typography>
      <Box mt={2}>
        <Typography variant="h6" color="textSecondary">
          {description || ""}
        </Typography>
      </Box>
    </div>
  );
};

export default Header;
