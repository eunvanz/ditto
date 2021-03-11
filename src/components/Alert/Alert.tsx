import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import ReactDOM from "react-dom";
import GlobalThemeProvider from "../GlobalThemeProvider";
import StoreProvider from "../StoreProvider";

export interface AlertProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const Alert = ({
  isVisible,
  onClose,
  title,
  message,
  okText = "OK",
  cancelText,
  onOk,
  onCancel,
}: AlertProps) => {
  const handleOnKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onOk?.();
      } else if (e.key === "Escape") {
        onCancel?.();
      }
    },
    [onCancel, onOk]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeydown);
    return () => {
      window.removeEventListener("keydown", handleOnKeydown);
    };
  }, [handleOnKeydown]);

  return (
    <Dialog fullWidth maxWidth="xs" open={isVisible} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelText && (
          <Button color="secondary" onClick={onCancel || onClose}>
            {cancelText}
          </Button>
        )}
        {okText && (
          <Button color="secondary" onClick={onOk || onClose}>
            {okText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const ProvidedAlert = (props: AlertProps) => {
  return (
    <StoreProvider>
      <GlobalThemeProvider>
        <Alert {...props} />
      </GlobalThemeProvider>
    </StoreProvider>
  );
};

Alert.message = ({ title, message }: { title: string; message: string }) => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const AlertContainer = () => {
      const [isAlertVisible, setIsAlertVisible] = useState(false);

      const handleOnOk = () => {
        setIsAlertVisible(false);
        setTimeout(() => {
          try {
            document.body.removeChild(container);
          } catch (error) {
            // FIXME: 두번 연속 실행되는 시점부터 오류가 남 (원인 불명)
          }
          resolve(undefined);
        }, 500);
      };

      useEffect(() => {
        setIsAlertVisible(true);
      }, []);

      return (
        <ProvidedAlert
          isVisible={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
          title={title}
          message={message}
          onOk={handleOnOk}
          cancelText={undefined}
        />
      );
    };

    ReactDOM.render(<AlertContainer />, container);
  });
};

Alert.confirm = ({
  title,
  message,
  okText,
  cancelText = "CANCEL",
}: {
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const AlertContainer = () => {
      const [isAlertVisible, setIsAlertVisible] = useState(false);

      const handleResolve = (isConfirmed: boolean) => {
        setIsAlertVisible(false);
        setTimeout(() => {
          try {
            document.body.removeChild(container);
          } catch (error) {
            // FIXME: 두번 연속 실행되는 시점부터 오류가 남 (원인 불명)
          }
          resolve(isConfirmed);
        }, 200);
      };

      const confirm = useCallback(() => {
        handleResolve(true);
      }, []);

      const cancel = useCallback(() => {
        handleResolve(false);
      }, []);

      useEffect(() => {
        setIsAlertVisible(true);
      }, []);

      return (
        <ProvidedAlert
          isVisible={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
          title={title}
          message={message}
          onOk={confirm}
          onCancel={cancel}
          okText={okText}
          cancelText={cancelText}
        />
      );
    };

    ReactDOM.render(<AlertContainer />, container);
  });
};

export default Alert;
