import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export interface CriticalConfirmDialogProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  keyword: string;
  onSubmit: () => void;
}

const CriticalConfirmDialog: React.FC<CriticalConfirmDialogProps> = ({
  isVisible,
  onClose,
  title,
  message,
  keyword,
  onSubmit,
}) => {
  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default CriticalConfirmDialog;
