import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { useForm } from "react-hook-form";

export interface CriticalConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  keyword: string;
  onSubmit: () => void;
}

const CriticalConfirmModal: React.FC<CriticalConfirmModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  keyword,
  onSubmit,
}) => {
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
  });

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{
                __html: message.replace("{", '<b>"').replace("}", '"</b>'),
              }}
            />
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="text"
            fullWidth
            inputRef={register({
              validate: (text: string) => {
                return (
                  text === keyword || `"${keyword}"를 정확하게 입력해주세요.`
                );
              },
            })}
            placeholder={`${keyword}`}
            error={!!errors.text}
            helperText={errors.text?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button" color="primary">
            취소
          </Button>
          <Button type="submit" color="primary">
            삭제
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CriticalConfirmModal;
