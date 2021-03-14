import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Snackbar,
  Theme,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing(0.5),
    },
    root: {
      "& .MuiSnackbarContent-root": {
        backgroundColor: theme.palette.secondary.main,
        color: "#fff",
        "& .MuiButtonBase-root": {
          color: "#fff",
        },
      },
    },
  })
);

export interface ConfirmSnackbarProps {
  message: string;
  isVisible: boolean;
  onConfirm: () => void;
  confirmText: string;
  onClose: () => void;
  key?: string;
}

const ConfirmSnackbar: React.FC<ConfirmSnackbarProps> = ({
  message,
  isVisible,
  onConfirm,
  confirmText,
  onClose,
  key,
}) => {
  const classes = useStyles();

  return (
    <Snackbar
      className={classes.root}
      key={key}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={isVisible}
      message={message}
      action={
        <>
          <Button size="small" onClick={onConfirm}>
            <div
              dangerouslySetInnerHTML={{
                __html: confirmText
                  .replace("{", '<b class="MuiTypography-colorPrimary">')
                  .replace("}", "</b>"),
              }}
            />
            {confirmText}
          </Button>
          <IconButton
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </>
      }
    />
  );
};

export default ConfirmSnackbar;
