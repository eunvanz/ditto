import React, { useCallback } from "react";
import SignInForm from "./SignInForm";
import { useDispatch } from "react-redux";
import { AuthActions } from "../../store/Auth/AuthSlice";

const SignInFormContainer = () => {
  const dispatch = useDispatch();

  const loginWithGoogle = useCallback(() => {
    return dispatch(AuthActions.signInWithGoogle());
  }, [dispatch]);

  return <SignInForm onClickGoogle={loginWithGoogle} />;
};

export default SignInFormContainer;
