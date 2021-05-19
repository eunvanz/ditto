import React, { useEffect, useMemo } from "react";
import { Box, Button, makeStyles, TextField, Theme } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import { useForm } from "react-hook-form";
import { checkHasAuthorization } from "../../helpers/projectHelpers";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";
import { getDangerButtonStyle } from "../../styles";
import { GroupDoc, MemberRole } from "../../types";
import Modal from "../Modal";

const useStyles = makeStyles((theme: Theme) => ({
  deleteButton: getDangerButtonStyle(theme),
}));

export interface GroupFormValues {
  name: string;
  target?: GroupDoc;
}

export interface GroupFormModalProps {
  defaultValues?: GroupFormValues;
  onSubmit: (values: GroupFormValues) => void;
  isSubmitting: boolean;
  isVisible: boolean;
  onClose: () => void;
  existingGroupNames?: string[];
  onDelete: () => void;
  role: MemberRole;
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  isVisible,
  onClose,
  existingGroupNames = [],
  onDelete,
  role,
}) => {
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    errors,
    watch,
    formState,
    reset,
  } = useForm<GroupFormValues>({
    mode: "onChange",
    defaultValues,
  });

  useSyncDefaultValues(reset, defaultValues);

  const watchedValues = watch();

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting;
  }, [isSubmitting]);

  const isNotModified = useMemo(() => {
    return isEqual(defaultValues, watchedValues);
  }, [defaultValues, watchedValues]);

  useEffect(() => {
    reset(defaultValues || { name: "" });
  }, [defaultValues, reset]);

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  return existingGroupNames ? (
    <Modal
      title={defaultValues ? "Modify group" : "Create new group"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({ ...values, target: defaultValues?.target }),
        )}
        noValidate
      >
        <Box mt={0}>
          <TextField
            autoFocus
            label="Group name"
            name="name"
            inputRef={register({
              required: "Group name is required.",
              maxLength: {
                value: 20,
                message: "Group name is too long.",
              },
              validate: (data: string) => {
                const isDup = existingGroupNames.some((groupName) => groupName === data);
                return isDup ? "Group name is duplicated." : true;
              },
            })}
            variant="outlined"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={!hasManagerAuthorization}
          />
        </Box>
        {hasManagerAuthorization && (
          <>
            <Box mt={2}>
              <Button
                color="secondary"
                disabled={isSubmitDisabled || isNotModified || !formState.isValid}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {defaultValues ? "Apply modifications" : "Create new group"}
              </Button>
            </Box>
            {defaultValues && (
              <Box mt={2}>
                <Button
                  className={classes.deleteButton}
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="button"
                  variant="contained"
                  onClick={onDelete}
                >
                  Delete group
                </Button>
              </Box>
            )}
          </>
        )}
      </form>
    </Modal>
  ) : null;
};

export default GroupFormModal;
