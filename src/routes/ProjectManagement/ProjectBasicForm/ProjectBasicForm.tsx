import React, { useMemo } from "react";
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
import isEqual from "lodash/isEqual";
import { useForm } from "react-hook-form";
import { checkHasAuthorization } from "../../../helpers/projectHelpers";
import useSyncDefaultValues from "../../../hooks/useSyncDefaultValues";
import { getDangerButtonStyle } from "../../../styles";
import { Theme } from "../../../theme";
import { MemberRole, ProjectDoc } from "../../../types";

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
  role: MemberRole;
  onLeave: () => void;
}

const ProjectBasicForm: React.FC<ProjectBasicFormProps> = ({
  project,
  onSubmit,
  isSubmitting,
  onDelete,
  role,
  onLeave,
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
    defaultValues: defaultValues,
  });

  useSyncDefaultValues(reset, defaultValues);

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
        <CardHeader title="Project basic information" />
        <Divider />
        <CardContent>
          <Box mt={0}>
            <TextField
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
              disabled={!checkHasAuthorization(role, "manager")}
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
              disabled={!checkHasAuthorization(role, "manager")}
            />
          </Box>
        </CardContent>
        {checkHasAuthorization(role, "manager") && (
          <>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              {checkHasAuthorization(role, "owner") ? (
                <Button
                  className={classes.deleteButton}
                  disabled={isSubmitting}
                  onClick={onDelete}
                  variant="contained"
                >
                  Delete project
                </Button>
              ) : (
                <Button
                  className={classes.deleteButton}
                  disabled={isSubmitting}
                  onClick={onLeave}
                  variant="contained"
                >
                  Leave project
                </Button>
              )}
              <Button
                color="secondary"
                disabled={isSubmitDisabled}
                type="submit"
                variant="contained"
                className={classes.submitButton}
              >
                Apply modifications
              </Button>
            </Box>
          </>
        )}
      </Card>
    </form>
  );
};

export default ProjectBasicForm;
