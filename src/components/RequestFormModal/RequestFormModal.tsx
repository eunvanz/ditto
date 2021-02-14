import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { ModalBase } from "../../types";
import Modal from "../Modal";

export interface RequestFormModalProps extends ModalBase {
  onSubmit: (values: RequestFormValues) => void;
  isSubmitting: boolean;
}

export interface RequestFormValues {
  name: string;
  summary: string;
  description: string;
}

const RequestFormModal: React.FC<RequestFormModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { register, handleSubmit, errors, formState } = useForm<
    RequestFormValues
  >({
    mode: "onChange",
  });

  return (
    <Modal title="리퀘스트 생성" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={2}>
          <TextField
            autoFocus
            label="리퀘스트 이름"
            name="name"
            inputRef={register({
              required: "리퀘스트 이름을 지어주세요.",
              maxLength: {
                value: 30,
                message: "이름이 너무 길어요.",
              },
            })}
            variant="outlined"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="리퀘스트 요약"
            name="summary"
            inputRef={register({
              maxLength: {
                value: 30,
                message: "요약이 너무 길어요.",
              },
            })}
            variant="outlined"
            fullWidth
            error={!!errors.summary}
            helperText={errors.summary?.message}
            placeholder="리퀘스트의 기능을 간략하게 요약해주세요."
          />
        </Box>
        <Box mt={2}>
          <TextField
            rows={3}
            multiline
            label="리퀘스트 설명"
            name="description"
            inputRef={register({
              maxLength: {
                value: 200,
                message: "설명이 너무 길어요.",
              },
            })}
            variant="outlined"
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            placeholder="리퀘스트의 세부적인 설명을 적어주세요."
          />
        </Box>
        <Box mt={2}>
          <Button
            color="secondary"
            disabled={isSubmitting || !formState.isValid}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            리퀘스트 만들기
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default RequestFormModal;
