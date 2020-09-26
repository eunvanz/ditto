import React, { useCallback } from "react";
import SignInForm from "./SignInForm";
import { useFirebase } from "react-redux-firebase";

const SignInFormContainer = () => {
  const firebase = useFirebase();

  const loginWithGoogle = useCallback(() => {
    return firebase.login({ provider: "google", type: "redirect" });
  }, [firebase]);

  return <SignInForm onClickGoogle={loginWithGoogle} />;
};

export default SignInFormContainer;
