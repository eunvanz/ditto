import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export interface MainViewProps {}

const MainView: React.FC<MainViewProps> = ({}) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Helmet>
        <title>Diitto - Sync up the APIs, Boost up the Project</title>
      </Helmet>
      <Typography variant="h1" color="textPrimary">
        Sync up the APIs, Boost up the Project
      </Typography>
      <Typography variant="h4" color="textSecondary">
        Service is under development.
      </Typography>
    </Container>
  );
};

export default MainView;
