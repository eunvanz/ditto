import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { Box, Button, makeStyles, TextField, Theme } from "@material-ui/core";
import Modal from "../Modal";
import { GroupDoc } from "../../types";

const useStyles = makeStyles((theme: Theme) => ({
  deleteButton: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
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
      title={defaultValues ? "그룹 수정" : "그룹 생성"}
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
            label="그룹 이름"
            name="name"
            inputRef={register({
              required: "그룹 이름을 지어주세요.",
              maxLength: {
                value: 20,
                message: "이름이 너무 길어요.",
              },
              validate: (data: string) => {
                const isDup = existingGroupNames.some(
                  (groupName) => groupName === data
                );
                return isDup ? "중복되는 이름이 있어요." : true;
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
            {defaultValues ? "그룹 정보 변경" : "그룹 만들기"}
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
              그룹 삭제
            </Button>
          </Box>
        )}
      </form>
    </Modal>
  ) : null;
};

export default GroupFormModal;
