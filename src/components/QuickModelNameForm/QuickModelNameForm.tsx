import React, { useMemo } from "react";
import { Box, Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { patterns } from "../../helpers/projectHelpers";

export interface QuickModelNameFormProps {
  onSubmit: (values: QuickModelNameFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: QuickModelNameFormValues;
  existingModelNames: string[];
}

export interface QuickModelNameFormValues {
  name: string;
  description: string;
}

const QuickModelNameForm: React.FC<QuickModelNameFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  existingModelNames,
}) => {
  const { register, handleSubmit, errors, watch, formState } = useForm<
    QuickModelNameFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  const watchedValues = watch();

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box mt={2}>
        <TextField
          autoFocus
          label="모델명"
          name="name"
          inputRef={register({
            required: "모델명을 입력해주세요.",
            maxLength: {
              value: 40,
              message: "모델명이 너무 길어요.",
            },
            validate: (data: string) => {
              const isDup = existingModelNames.some((item) => item === data);
              return isDup ? "중복되는 모델이 있어요." : true;
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
          label="설명"
          name="description"
          inputRef={register({
            maxLength: {
              value: 100,
              message: "설명이 너무 길어요.",
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
          disabled={isSubmitting || isNotModified || !formState.isValid}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {defaultValues ? "변경사항 저장" : "모델 생성"}
        </Button>
      </Box>
    </form>
  );
};

export default QuickModelNameForm;
