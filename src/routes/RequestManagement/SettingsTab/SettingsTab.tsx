import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  makeStyles,
  TextField,
} from "@material-ui/core";
import isEqual from "lodash/isEqual";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  checkHasAuthorization,
  getTextFieldErrorProps,
  patterns,
} from "../../../helpers/projectHelpers";
import { getDangerButtonStyle } from "../../../styles";
import { Theme } from "../../../theme";
import { GroupDoc, MemberRole, RequestDoc } from "../../../types";
import useSyncDefaultValues from "../../../hooks/useSyncDefaultValues";

const useStyles = makeStyles((theme: Theme) => ({
  submitButton: {
    marginLeft: 8,
  },
  deleteButton: getDangerButtonStyle(theme),
  groupSelect: {
    width: "100%",
  },
}));

export interface SettingsTabProps {
  projectGroups: GroupDoc[];
  request: RequestDoc;
  requests: RequestDoc[];
  onSubmit: (values: RequestSettingFormValues) => void;
  isSubmitting: boolean;
  onDelete: () => void;
  role: MemberRole;
}

export interface RequestSettingFormValues {
  name: string;
  groupId?: string;
  // summary?: string;
  description?: string;
  operationId?: string;
  isDeprecated: boolean;
  target?: RequestDoc;
}

const SettingTab: React.FC<SettingsTabProps> = ({
  projectGroups,
  request,
  requests,
  onSubmit,
  isSubmitting,
  onDelete,
  role,
}) => {
  const classes = useStyles();

  const defaultValues = useMemo(() => {
    return {
      name: request.name || "",
      // summary: request.summary || "",
      description: request.description || "",
      operationId: request.operationId || "",
      isDeprecated: request.isDeprecated,
      groupId: request.groupId,
    };
  }, [
    request.description,
    request.groupId,
    request.isDeprecated,
    request.name,
    request.operationId,
  ]);

  const { register, errors, watch, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  useSyncDefaultValues(reset, defaultValues);

  const watchedValues = watch();

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || isNotModified;
  }, [isNotModified, isSubmitting]);

  const handleOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await handleSubmit((data) => {
        onSubmit({
          ...data,
          groupId: data.groupId === "none" ? "" : data.groupId,
          isDeprecated: data.isDeprecated ? true : false,
          target: request,
        });
      })();
    },
    [handleSubmit, onSubmit, request]
  );

  return (
    <form onSubmit={handleOnSubmit}>
      <Card>
        <CardHeader title="Operation settings" />
        <Divider />
        <CardContent>
          <Box>
            <TextField
              label="Operation name"
              name="name"
              inputRef={register({
                required: "Operation name is required.",
                maxLength: {
                  value: 50,
                  message: "Operation name is too long",
                },
                validate: (data: string) => {
                  const isDup = requests
                    .filter((item) => item.id !== request.id)
                    .some((item) => item.name === data);
                  return isDup ? "Operation name is duplicated." : true;
                },
              })}
              variant="outlined"
              fullWidth
              required
              {...getTextFieldErrorProps(errors.name)}
              disabled={!hasManagerAuthorization}
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Operation ID"
              name="operationId"
              inputRef={register({
                maxLength: {
                  value: 50,
                  message: "Operation ID is too long",
                },
                validate: (data: string) => {
                  const isDup =
                    data &&
                    requests
                      .filter((item) => item.id !== request.id)
                      .some((item) => item.operationId === data);
                  return isDup ? "Operation ID is duplicated." : true;
                },
                pattern: patterns.wordsWithNoSpace,
              })}
              variant="outlined"
              fullWidth
              {...getTextFieldErrorProps(errors.operationId)}
              placeholder="Unique string used to identify an operation"
              disabled={!hasManagerAuthorization}
            />
          </Box>
          <Box mt={2}>
            <TextField
              rows={2}
              label="Description"
              name="description"
              inputRef={register({
                maxLength: {
                  value: 200,
                  message: "Description is too long",
                },
              })}
              variant="outlined"
              fullWidth
              {...getTextFieldErrorProps(errors.description)}
              placeholder="Detailed description of this operation"
              disabled={!hasManagerAuthorization}
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Group"
              name="groupId"
              select
              variant="outlined"
              inputRef={register}
              className={classes.groupSelect}
              SelectProps={{ native: true }}
              disabled={!hasManagerAuthorization}
            >
              <option value="none">[ None ]</option>
              {projectGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </TextField>
          </Box>
          <Box mt={2}>
            <FormControlLabel
              label="Deprecated"
              control={
                <Checkbox
                  name="isDeprecated"
                  inputRef={register}
                  defaultChecked={defaultValues.isDeprecated}
                  disabled={!hasManagerAuthorization}
                />
              }
            />
          </Box>
        </CardContent>
        {hasManagerAuthorization && (
          <>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              {checkHasAuthorization(role, "owner") && (
                <Button
                  className={classes.deleteButton}
                  disabled={isSubmitting}
                  onClick={onDelete}
                  variant="contained"
                >
                  Delete operation
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

export default SettingTab;
