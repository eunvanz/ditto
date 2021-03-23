import React, { useMemo } from "react";
import { TextField, Box, Button } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import { useForm } from "react-hook-form";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";

export interface ProjectFormProps {
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: ProjectFormValues;
}

export interface ProjectFormValues {
  title: string;
  description: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
}) => {
  const { register, handleSubmit, errors, watch, formState, reset } = useForm<
    ProjectFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  const watchedValues = watch();

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting;
  }, [isSubmitting]);

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  useSyncDefaultValues(reset, defaultValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box mt={2}>
        <TextField
          autoFocus
          label="Project name"
          name="title"
          inputRef={register({
            required: "Project name is required.",
            maxLength: {
              value: 20,
              message: "Project name is too long.",
            },
          })}
          variant="outlined"
          fullWidth
          required
          error={!!errors.title}
          helperText={errors.title?.message}
        />
      </Box>
      <Box mt={2}>
        <TextField
          label="Description"
          name="description"
          inputRef={register({
            maxLength: {
              value: 50,
              message: "Description is too long.",
            },
          })}
          variant="outlined"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
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
          {defaultValues ? "Apply modifications" : "Create new project"}
        </Button>
      </Box>
    </form>
  );
};

export default ProjectForm;
