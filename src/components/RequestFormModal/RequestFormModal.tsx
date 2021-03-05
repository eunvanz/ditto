import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { ModalBase, RequestDoc } from "../../types";
import Modal from "../Modal";

export interface RequestFormModalProps extends ModalBase {
  onSubmit: (values: RequestFormValues) => void;
  isSubmitting: boolean;
  requests: RequestDoc[];
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
  requests,
}) => {
  const { register, handleSubmit, errors, formState } = useForm<
    RequestFormValues
  >({
    mode: "onChange",
  });

  return (
    <Modal title="Create new operation" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={2}>
          <TextField
            autoFocus
            label="Operation name"
            name="name"
            inputRef={register({
              required: "Operation name is required.",
              maxLength: {
                value: 30,
                message: "Operation name is too long.",
              },
              validate: (data: string) => {
                const isDup = requests.some((item) => item.name === data);
                return isDup ? "Operation name is duplicated." : true;
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
            label="Summary"
            name="summary"
            inputRef={register({
              maxLength: {
                value: 30,
                message: "Summary is too long.",
              },
            })}
            variant="outlined"
            fullWidth
            error={!!errors.summary}
            helperText={errors.summary?.message}
            placeholder="Summary of this operation"
          />
        </Box>
        <Box mt={2}>
          <TextField
            rows={3}
            multiline
            label="Description"
            name="description"
            inputRef={register({
              maxLength: {
                value: 200,
                message: "Description is too long.",
              },
            })}
            variant="outlined"
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            placeholder="Detailed description of this operation"
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
            Create new operation
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default RequestFormModal;
