import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { ProjectUrlDoc } from "../../../types";
import { Grid, TextField, Button } from "@material-ui/core";
import { regExps } from "../../../helpers/commonHelpers";

export interface ProjectUrlFormValues {
  title: string;
  url: string;
}

export interface ProjectUrlFormProps {
  isSubmitting: boolean;
  onSubmit: (values: ProjectUrlFormValues) => void;
  onDelete: () => void;
  projectUrl?: ProjectUrlDoc;
}

const ProjectUrlForm: React.FC<ProjectUrlFormProps> = ({
  isSubmitting,
  onSubmit,
  onDelete,
  projectUrl,
}) => {
  const defaultValues = useMemo(() => {
    return {
      title: projectUrl?.title,
      url: projectUrl?.url,
    };
  }, [projectUrl]);

  const { register, handleSubmit, errors, watch, reset } = useForm<
    ProjectUrlFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchedValues = watch();

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item sm={3}>
          <TextField
            label="라벨"
            name="title"
            inputRef={register({
              required: "이름표를 붙여주세요.",
              maxLength: {
                value: 20,
                message: "라벨이 너무 길어요.",
              },
            })}
            variant="outlined"
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="이름표를 붙여주세요."
          />
        </Grid>
        <Grid item sm={6}>
          <TextField
            label="베이스 URL"
            name="url"
            inputRef={register({
              required: "베이스 URL을 입력해주세요.",
              maxLength: {
                value: 100,
                message: "URL이 너무 길어요.",
              },
              pattern: {
                value: regExps.url,
                message: "URL형식으로 입력해주세요.",
              },
            })}
            variant="outlined"
            fullWidth
            required
            error={!!errors.url}
            helperText={errors.url?.message}
            placeholder="https://api.codit.to"
          />
        </Grid>
        <Grid item sm={3}>
          <Button type="submit" disabled={isSubmitting}>
            저장
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProjectUrlForm;
