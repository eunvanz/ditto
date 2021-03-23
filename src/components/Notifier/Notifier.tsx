import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { RootState } from "../../store";
import UiSlice from "../../store/Ui/UiSlice";

let displayed: React.ReactText[] = [];

const Notifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((store: RootState) => store.ui.notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: React.ReactText) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: React.ReactText) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
        closeSnackbar(key);
        return;
      }

      if (displayed.includes(key)) {
        return;
      }

      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (_event, myKey) => {
          dispatch(UiSlice.actions.removeNotification(myKey));
          removeDisplayed(myKey);
        },
      });

      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
