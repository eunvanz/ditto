import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import shortId from "shortid";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import ConfirmSnackbar from "./ConfirmSnackbar";

const ConfirmSnackbarContainer = () => {
  const dispatch = useDispatch();

  const { isVisible, confirmText, message, confirmAction } = useSelector(
    UiSelectors.selectConfirmSnackbar,
  );

  const key = useMemo(() => {
    if (message) {
      return shortId.generate();
    }
  }, [message]);

  const handleOnClose = useCallback(() => {
    dispatch(UiActions.hideConfirmSnackbar());
  }, [dispatch]);

  const handleOnConfirm = useCallback(() => {
    dispatch(confirmAction);
  }, [confirmAction, dispatch]);

  return (
    <ConfirmSnackbar
      snackbarKey={key}
      isVisible={isVisible}
      onClose={handleOnClose}
      confirmText={confirmText}
      message={message}
      onConfirm={handleOnConfirm}
    />
  );
};

export default ConfirmSnackbarContainer;
