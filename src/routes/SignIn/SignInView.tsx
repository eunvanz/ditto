import React from "react";
import {
  makeStyles,
  Container,
  Box,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import SignInForm from "../../components/SignInForm";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80,
  },
  cardContent: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    minHeight: 150,
  },
}));

export interface SignInViewProps {}

const SignInView: React.FC<SignInViewProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.cardContainer} maxWidth="sm">
        <Box mb={8} display="flex" justifyContent="center">
          <RouterLink to="/">codit</RouterLink>
        </Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              mb={3}
            >
              <div>
                <Typography color="textPrimary" gutterBottom variant="h2">
                  Sign in
                </Typography>
              </div>
            </Box>
            <Box flexGrow={1} mt={3}>
              <SignInForm />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SignInView;
