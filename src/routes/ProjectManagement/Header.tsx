import React, { FC } from "react";
import clsx from "clsx";
import { Typography, makeStyles, Box } from "@material-ui/core";

interface HeaderProps {
  className?: string;
  title: string;
  description: string;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const Header: FC<HeaderProps> = ({
  className,
  title,
  description,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Typography variant="h3" color="textPrimary">
        {title}
      </Typography>
      <Box mt={1}>
        <Typography variant="h6" color="textSecondary">
          {description || ""}
        </Typography>
      </Box>
    </div>
  );
};

export default Header;
