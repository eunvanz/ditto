import React from "react";
import {
  makeStyles,
  Dialog,
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
  DialogProps,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Theme } from "../../theme";

const useStyles = makeStyles((_: Theme) => ({
  cardHeader: {
    "&> .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
  },
}));

export interface ModalProps extends Omit<DialogProps, "open"> {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  title,
  ...restProps
}) => {
  const classes = useStyles();

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth {...restProps}>
      <Card>
        <CardHeader
          title={title}
          action={
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          className={classes.cardHeader}
        />
        <Divider />
        <CardContent>{children}</CardContent>
      </Card>
    </Dialog>
  );
};

export default Modal;
