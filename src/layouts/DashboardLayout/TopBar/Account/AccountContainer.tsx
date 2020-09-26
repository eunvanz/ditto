import React, { useCallback } from "react";
import Account from "./Account";
import useAuth from "../../../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { UiActions } from "../../../../store/Ui/UiSlice";
import { AuthActions } from "../../../../store/Auth/AuthSlice";

const AccountContainer = () => {
  const user = useAuth();

  const dispatch = useDispatch();

  const logout = useCallback(() => {
    return dispatch(AuthActions.signOut());
  }, [dispatch]);

  const showSignInModal = useCallback(() => {
    dispatch(UiActions.showSignInModal());
  }, [dispatch]);

  return (
    <Account user={user} onLogout={logout} onClickLogin={showSignInModal} />
  );
};

export default AccountContainer;
