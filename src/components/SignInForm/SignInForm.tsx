import React from "react";
import googleImage from "../../imgs/google.svg";
import { Button, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  googleButton: {
    backgroundColor: theme.palette.common.white,
  },
  providerIcon: {
    marginRight: theme.spacing(2),
  },
  divider: {
    flexGrow: 1,
  },
  dividerText: {
    margin: theme.spacing(2),
  },
}));

export interface SignInFormProps {
  onClickGoogle: () => void;
  isSigningIn: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onClickGoogle,
  isSigningIn,
}) => {
  const classes = useStyles();

  return (
    <>
      <Button
        className={classes.googleButton}
        fullWidth
        onClick={onClickGoogle}
        size="large"
        variant="contained"
        disabled={isSigningIn}
      >
        <img alt="Google" className={classes.providerIcon} src={googleImage} />
        Sign in with Google
      </Button>
    </>
  );
};

export default SignInForm;
