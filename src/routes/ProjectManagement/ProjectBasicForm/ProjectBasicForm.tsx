import React, { useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  Box,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { ProjectDoc } from "../../../types";
import { Theme } from "../../../theme";
import { getDangerButtonStyle } from "../../../styles";

const useStyles = makeStyles((theme: Theme) => ({
  submitButton: {
    marginLeft: 8,
  },
  deleteButton: getDangerButtonStyle(theme),
}));

export interface ProjectBasicFormValues {
  title: string;
  description: string;
}

export interface ProjectBasicFormProps {
  project: ProjectDoc;
  onSubmit: (values: ProjectBasicFormValues) => void;
  isSubmitting: boolean;
  onDelete: () => void;
}

const ProjectBasicForm: React.FC<ProjectBasicFormProps> = ({
  project,
  onSubmit,
  isSubmitting,
  onDelete,
}) => {
  const classes = useStyles();

  const defaultValues = useMemo(() => {
    return {
      title: project.title,
      description: project.description,
    };
  }, [project.title, project.description]);

  const { register, handleSubmit, errors, watch, reset } = useForm<
    ProjectBasicFormValues
  >({
    mode: "onChange",
    defaultValues: {
      title: project.title,
      description: project.description,
    },
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchedValues = watch();

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || isNotModified;
  }, [isNotModified, isSubmitting]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader title="프로젝트 기본정보" />
        <Divider />
        <CardContent>
          <Box mt={0}>
            <TextField
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
        </CardContent>
        <Divider />
        <Box p={2} display="flex" justifyContent="flex-end">
          <Button
            className={classes.deleteButton}
            disabled={isSubmitting}
            onClick={onDelete}
            variant="contained"
          >
            프로젝트 삭제
          </Button>
          <Button
            color="secondary"
            disabled={isSubmitDisabled}
            type="submit"
            variant="contained"
            className={classes.submitButton}
          >
            변경사항 저장
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default ProjectBasicForm;
