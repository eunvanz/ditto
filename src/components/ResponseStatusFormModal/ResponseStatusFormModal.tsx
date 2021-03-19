import { Box, Button, TextField } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getTextFieldErrorProps } from "../../helpers/projectHelpers";
import { ResponseStatusDoc } from "../../types";
import Modal from "../Modal";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";

export interface ResponseStatusFormValues {
  statusCode: number;
  description: string;
  target?: ResponseStatusDoc;
}

export interface ResponseStatusFormModalProps {
  defaultValues?: ResponseStatusFormValues;
  isVisible: boolean;
  onClose: () => void;
  existingStatusCodes: number[];
  onSubmit: (values: ResponseStatusFormValues) => void;
  isSubmitting: boolean;
}

const ResponseStatusFormModal: React.FC<ResponseStatusFormModalProps> = ({
  defaultValues,
  isVisible,
  onClose,
  existingStatusCodes,
  onSubmit,
  isSubmitting,
}) => {
  const { register, handleSubmit, errors, formState, watch, reset } = useForm<
    ResponseStatusFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  useSyncDefaultValues(reset, defaultValues);

  const watchedValues = watch();

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting;
  }, [isSubmitting]);

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  return (
    <Modal
      title={defaultValues ? "Modify status code" : "Create new status code"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({
            ...values,
            // 알 수 없는 버그로 인해 직접 세팅
            statusCode: watchedValues.statusCode,
            target: defaultValues?.target,
          })
        )}
        noValidate
      >
        <Box mt={0}>
          <TextField
            autoFocus
            label="Status code"
            name="statusCode"
            inputRef={register({
              required: "Status code is required.",
              minLength: {
                value: 3,
                message: "Status code must be a 3-digit number.",
              },
              maxLength: {
                value: 3,
                message: "Status code must be a 3-digit number.",
              },
              valueAsNumber: true,
              validate: (data: string) => {
                if (isNaN(Number(data))) {
                  return "Status code must be a number.";
                } else if (Number(data) < 0) {
                  return "Status code must be a positive number.";
                } else if (existingStatusCodes.includes(Number(data))) {
                  return "Status code is duplicated.";
                }
                return true;
              },
            })}
            variant="outlined"
            fullWidth
            required
            disabled={defaultValues?.statusCode === 200}
            {...getTextFieldErrorProps(errors.statusCode)}
          />
        </Box>
        <Box mt={2}>
          <TextField
            autoFocus={defaultValues?.statusCode === 200}
            label="Description"
            name="description"
            inputRef={register({
              maxLength: {
                value: 40,
                message: "Description is too long.",
              },
            })}
            variant="outlined"
            fullWidth
            {...getTextFieldErrorProps(errors.description)}
          />
        </Box>
        <Box mt={2}>
          <Button
            color="secondary"
            disabled={isSubmitDisabled || isNotModified || !formState.isValid}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            {defaultValues ? "Apply modifications" : "Create new status code"}
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default ResponseStatusFormModal;
