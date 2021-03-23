import React, { useCallback } from "react";
import SignInForm from "./SignInForm";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../../store/Auth/AuthSlice";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";

const SignInFormContainer = () => {
  const dispatch = useDispatch();

  const isSigningIn = useSelector(
    ProgressSelectors.createInProgressSelector(AuthActions.signInWithGoogle.type),
  );

  const loginWithGoogle = useCallback(() => {
    return dispatch(AuthActions.signInWithGoogle());
  }, [dispatch]);

  return <SignInForm onClickGoogle={loginWithGoogle} isSigningIn={isSigningIn} />;
};

export default SignInFormContainer;
