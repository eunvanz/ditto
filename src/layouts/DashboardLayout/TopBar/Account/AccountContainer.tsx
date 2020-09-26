import React, { useCallback } from "react";
import Account from "./Account";
import useAuth from "../../../../hooks/useAuth";
import { useFirebase } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import { UiActions } from "../../../../store/Ui/UiSlice";

const AccountContainer = () => {
  const user = useAuth();

  const firebase = useFirebase();

  const logout = useCallback(() => {
    return firebase.logout();
  }, [firebase]);

  const dispatch = useDispatch();

  const showSignInModal = useCallback(() => {
    dispatch(UiActions.showSignInModal());
  }, [dispatch]);

  return (
    <Account user={user} onLogout={logout} onClickLogin={showSignInModal} />
  );
};

export default AccountContainer;
