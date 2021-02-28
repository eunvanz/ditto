import React, { useMemo } from "react";
import { Box, Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { patterns } from "../../helpers/projectHelpers";
import { ModelNameFormValues } from "../ModelForm/ModelNameForm";

export interface QuickModelNameFormProps {
  onSubmit: (values: ModelNameFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: ModelNameFormValues;
  existingModelNames: string[];
}

const QuickModelNameForm: React.FC<QuickModelNameFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  existingModelNames,
}) => {
  const { register, handleSubmit, errors, watch, formState } = useForm<
    ModelNameFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  const watchedValues = watch();

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  const isSubmittable = useMemo(() => {
    return !isSubmitting && !isNotModified && formState.isValid;
  }, [formState.isValid, isNotModified, isSubmitting]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box mt={2}>
        <TextField
          autoFocus
          label="Model name"
          name="name"
          inputRef={register({
            required: "Model name is required.",
            maxLength: {
              value: 40,
              message: "Model name is too long.",
            },
            validate: (data: string) => {
              const isDup = existingModelNames.some((item) => item === data);
              return isDup ? "Model name is duplicated." : true;
            },
            pattern: patterns.wordsWithNoSpace,
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
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Box>
      <Box mt={2}>
        <Button
          color="secondary"
          disabled={!isSubmittable}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {defaultValues ? "Apply modifications" : "Create new model"}
        </Button>
      </Box>
    </form>
  );
};

export default QuickModelNameForm;
