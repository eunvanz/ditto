import React, { useState, useEffect } from "react";
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
  okText = "확인",
  cancelText,
  onOk,
  onCancel,
}: AlertProps) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={isVisible} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelText && (
          <Button onClick={onCancel || onClose}>{cancelText}</Button>
        )}
        {okText && (
          <Button
            onClick={onOk || onClose}
            variant="contained"
            color="secondary"
          >
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
          document.body.removeChild(container);
          resolve();
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
  cancelText = "취소",
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
          document.body.removeChild(container);
          resolve(isConfirmed);
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
          onOk={() => handleResolve(true)}
          onCancel={() => handleResolve(false)}
          okText={okText}
          cancelText={cancelText}
        />
      );
    };

    ReactDOM.render(<AlertContainer />, container);
  });
};

export default Alert;
