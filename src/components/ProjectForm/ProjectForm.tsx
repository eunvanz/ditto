import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { TextField, Box, Button } from "@material-ui/core";
import isEqual from "lodash/isEqual";

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
  const { register, handleSubmit, errors, watch } = useForm<ProjectFormValues>({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box mt={2}>
        <TextField
          autoFocus
          label="프로젝트 이름"
          name="title"
          inputRef={register({
            required: "프로젝트 이름을 지어주세요.",
            maxLength: {
              value: 20,
              message: "이름이 너무 길어요.",
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
          label="프로젝트 설명"
          name="description"
          inputRef={register({
            maxLength: {
              value: 50,
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
          disabled={isSubmitDisabled || isNotModified}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {defaultValues ? "프로젝트 설정 저장" : "프로젝트 만들기"}
        </Button>
      </Box>
    </form>
  );
};

export default ProjectForm;
