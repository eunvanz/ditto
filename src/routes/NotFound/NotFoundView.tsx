import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  makeStyles,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import { Theme } from "../../theme";
import notFoundImage from "../../imgs/not_found.svg";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    width: 560,
    maxHeight: 300,
    height: "auto",
  },
}));

export interface NotFoundViewProps {
  title?: string;
  description?: string;
}

const NotFoundView: FC<NotFoundViewProps> = ({ title, description }) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className={classes.root}>
      <Helmet>
        <title>404 Not found - Diitto</title>
      </Helmet>
      <Container maxWidth="lg">
        <Typography
          align="center"
          variant={mobileDevice ? "h4" : "h1"}
          color="textPrimary"
        >
          {title || "404: The page you are looking for isn’t here"}
        </Typography>
        <Typography align="center" variant="subtitle2" color="textSecondary">
          {description ||
            "You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation."}
        </Typography>
        <Box mt={6} display="flex" justifyContent="center">
          <img
            alt="Under development"
            className={classes.image}
            src={notFoundImage}
          />
        </Box>
        <Box mt={6} display="flex" justifyContent="center">
          <Button
            color="secondary"
            component={RouterLink}
            to="/"
            variant="outlined"
          >
            Back to home
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default NotFoundView;
