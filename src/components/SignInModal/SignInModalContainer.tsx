import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import UiSlice from "../../store/Ui/UiSlice";
import SignInModal from "./SignInModal";

const SignInModalContainer = () => {
  const isVisible = useSelector((state: RootState) => state.ui.signInModal.isVisible);

  const dispatch = useDispatch();

  const handleOnClose = useCallback(() => {
    dispatch(UiSlice.actions.hideSignInModal());
  }, [dispatch]);

  return <SignInModal isVisible={isVisible} onClose={handleOnClose} />;
};

export default SignInModalContainer;
