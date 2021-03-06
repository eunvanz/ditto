import React from "react";
import { Box, Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import {
  getTextFieldErrorProps,
  methodOptions,
  patterns,
} from "../../helpers/projectHelpers";
import { ModalBase, RequestDoc, REQUEST_METHOD } from "../../types";
import Modal from "../Modal";

export interface RequestFormModalProps extends ModalBase {
  onSubmit: (values: RequestFormValues) => void;
  isSubmitting: boolean;
  requests: RequestDoc[];
}

export interface RequestFormValues {
  name: string;
  method: REQUEST_METHOD;
  description: string;
  operationId: string;
}

const RequestFormModal: React.FC<RequestFormModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting,
  requests,
}) => {
  const { register, handleSubmit, errors, formState } = useForm<RequestFormValues>({
    mode: "onChange",
  });

  return (
    <Modal title="Create new operation" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextField
            autoFocus
            label="Operation name"
            name="name"
            inputRef={register({
              required: "Operation name is required.",
              maxLength: {
                value: 50,
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
            label="Method"
            name="method"
            select
            variant="outlined"
            inputRef={register}
            SelectProps={{ native: true }}
            fullWidth
            required
            {...getTextFieldErrorProps(errors.method)}
          >
            {methodOptions.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </TextField>
        </Box>
        <Box mt={2}>
          <TextField
            label="Operation ID"
            name="operationId"
            inputRef={register({
              maxLength: {
                value: 50,
                message: "Operation ID is too long",
              },
              validate: (data: string) => {
                const isDup = data && requests.some((item) => item.operationId === data);
                return isDup ? "Operation ID is duplicated." : true;
              },
              pattern: patterns.wordsWithNoSpace,
            })}
            variant="outlined"
            fullWidth
            {...getTextFieldErrorProps(errors.operationId)}
            placeholder="Unique string used to identify an operation"
          />
        </Box>
        <Box mt={2}>
          <TextField
            rows={2}
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
