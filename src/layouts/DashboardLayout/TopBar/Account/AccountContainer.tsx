import React, { useCallback } from "react";
import Account from "./Account";
import useAuth from "../../../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { UiActions } from "../../../../store/Ui/UiSlice";
import { AuthActions } from "../../../../store/Auth/AuthSlice";
import Alert from "../../../../components/Alert";

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

  return (
    <Account user={user} onLogout={logout} onClickLogin={showSignInModal} />
  );
};

export default AccountContainer;
