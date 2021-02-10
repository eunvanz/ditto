import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { Box, Button, TextField } from "@material-ui/core";
import Modal from "../Modal";
import { GroupDoc } from "../../types";

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
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  isVisible,
  onClose,
  existingGroupNames,
}) => {
  const { register, handleSubmit, errors, watch, formState } = useForm<
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

  return existingGroupNames ? (
    <Modal
      title={defaultValues ? "그룹 수정" : "그룹 생성"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
      </form>
    </Modal>
  ) : null;
};

export default GroupFormModal;
