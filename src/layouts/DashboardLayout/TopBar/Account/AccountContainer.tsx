import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import Alert from "../../../../components/Alert";
import useAuth from "../../../../hooks/useAuth";
import { AuthActions } from "../../../../store/Auth/AuthSlice";
import { UiActions } from "../../../../store/Ui/UiSlice";
import Account from "./Account";

const AccountContainer = () => {
  const { user } = useAuth();

  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    const isConfirmed = await Alert.confirm({
      title: "Sign out",
      message: "Are you sure to sign out?",
    });
    if (isConfirmed) {
      dispatch(AuthActions.signOut());
    }
  }, [dispatch]);

  const showSignInModal = useCallback(() => {
    dispatch(UiActions.showSignInModal());
  }, [dispatch]);

  return <Account user={user} onLogout={logout} onClickLogin={showSignInModal} />;
};

export default AccountContainer;
