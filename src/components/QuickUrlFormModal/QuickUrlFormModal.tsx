import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { regExps } from "../../helpers/commonHelpers";
import { getTextFieldErrorProps } from "../../helpers/projectHelpers";
import { ProjectUrlFormValues } from "../../routes/ProjectManagement/ProjectUrlForm/ProjectUrlForm";
import { ProjectUrlDoc } from "../../types";
import Modal from "../Modal";

export interface QuickUrlFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectUrlFormValues) => void;
  isSubmitting: boolean;
  existingUrls: ProjectUrlDoc[];
}

const QuickUrlFormModal: React.FC<QuickUrlFormModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting,
  existingUrls,
}) => {
  const { handleSubmit, register, errors, formState } = useForm<ProjectUrlFormValues>({
    mode: "onChange",
  });

  return (
    <Modal title="Create new base URL" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mt={2}>
          <TextField
            autoFocus
            label="Label"
            name="label"
            inputRef={register({
              required: "Label is required.",
              maxLength: {
                value: 20,
                message: "Label is too long.",
              },
              validate: (data: string) => {
                const isDup = existingUrls.some((item) => item.label === data);
                return isDup ? "Label is duplicated." : true;
              },
            })}
            variant="outlined"
            fullWidth
            required
            {...getTextFieldErrorProps(errors.label)}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="URL"
            name="url"
            inputRef={register({
              required: "URL is required.",
              maxLength: {
                value: 100,
                message: "URL is too long.",
              },
              pattern: {
                value: regExps.url,
                message: "URL is not valid.",
              },
              validate: (data: string) => {
                const dupUrl = existingUrls.find((item) => item.url === data);
                return dupUrl ? `URL is duplicated with ${dupUrl.label}` : true;
              },
            })}
            variant="outlined"
            fullWidth
            required
            {...getTextFieldErrorProps(errors.url)}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Description"
            name="description"
            inputRef={register({
              maxLength: {
                value: 100,
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
            disabled={isSubmitting || !formState.isValid}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Create new base URL
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default QuickUrlFormModal;
