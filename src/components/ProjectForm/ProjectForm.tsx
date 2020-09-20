import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { TextField, Box, Button } from "@material-ui/core";

export interface ProjectFormProps {
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting: boolean;
}

interface ProjectFormValues {
  title: string;
  description: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const { register, handleSubmit, errors } = useForm<ProjectFormValues>({
    mode: "all",
  });

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting;
  }, [isSubmitting]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box mt={2}>
        <TextField
          label="프로젝트 이름"
          name="title"
          inputRef={register({
            required: "프로젝트 이름을 입력해주세요.",
            maxLength: {
              value: 20,
              message: "20자 이내로 입력해주세요.",
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
              message: "50자 이내로 입력해주세요.",
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
          disabled={isSubmitDisabled}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          프로젝트 생성
        </Button>
      </Box>
    </form>
  );
};

export default ProjectForm;
