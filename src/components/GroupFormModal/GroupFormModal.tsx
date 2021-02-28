import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { Box, Button, makeStyles, TextField, Theme } from "@material-ui/core";
import Modal from "../Modal";
import { GroupDoc } from "../../types";
import { getDangerButtonStyle } from "../../styles";

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
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  isVisible,
  onClose,
  existingGroupNames,
  onDelete,
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, watch, formState, reset } = useForm<
    GroupFormValues
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

  useEffect(() => {
    reset(defaultValues || { name: "" });
  }, [defaultValues, reset]);

  return existingGroupNames ? (
    <Modal
      title={defaultValues ? "Modify group" : "Create group"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit({ ...values, target: defaultValues?.target })
        )}
        noValidate
      >
        <Box mt={2}>
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
                const isDup = existingGroupNames.some(
                  (groupName) => groupName === data
                );
                return isDup ? "Group name is duplicated." : true;
              },
            })}
            variant="outlined"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
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
            {defaultValues ? "Apply modifications" : "Create"}
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
              Delete this group
            </Button>
          </Box>
        )}
      </form>
    </Modal>
  ) : null;
};

export default GroupFormModal;
