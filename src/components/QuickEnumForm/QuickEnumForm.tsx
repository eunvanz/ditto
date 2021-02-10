import { Box, Button, TextField } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { patterns } from "../../helpers/projectHelpers";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import { EnumerationDoc, FIELD_TYPE } from "../../types";
import uniq from "lodash/uniq";

export interface QuickEnumFormProps {
  onSubmit: (values: EnumFormValues) => void;
  isSubmitting: boolean;
  fieldType: FIELD_TYPE.INTEGER | FIELD_TYPE.STRING;
  existingEnumerations?: EnumerationDoc[];
}

const QuickEnumForm: React.FC<QuickEnumFormProps> = ({
  onSubmit,
  isSubmitting,
  existingEnumerations,
  fieldType,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    trigger,
    getValues,
  } = useForm<EnumFormValues>({
    mode: "onChange",
  });

  const isSubmittable = useMemo(() => {
    return !isSubmitting && formState.isValid;
  }, [formState.isValid, isSubmitting]);

  const handleOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      trigger();
      await handleSubmit(() => {
        onSubmit({ ...getValues(), fieldType });
      })();
    },
    [fieldType, getValues, handleSubmit, onSubmit, trigger]
  );

  return existingEnumerations ? (
    <form onSubmit={handleOnSubmit} noValidate>
      <Box mt={2}>
        <TextField
          autoFocus
          label="열거형 명"
          name="name"
          inputRef={register({
            required: "이름을 지어주세요.",
            maxLength: {
              value: 40,
              message: "이름이 너무 길어요.",
            },
            validate: (data: string) => {
              const isDup = existingEnumerations.some(
                (item) => item.name === data
              );
              return isDup ? "중복되는 이름이 있어요." : true;
            },
            pattern: patterns.wordsWithNoSpace,
          })}
          variant="outlined"
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Box>
      <Box mt={2}>
        <TextField
          name="items"
          label="값"
          onChange={(e) => {
            const { value } = e.target;
            setValue("items", value.replace(" ", ""));
            trigger();
          }}
          inputRef={register({
            required: "값을 입력해주세요.",
            maxLength: {
              value: 500,
              message: "이렇게 많이 쓸일이 있을까요?",
            },
            validate: {
              pattern: (value) => {
                if (fieldType === FIELD_TYPE.STRING) {
                  return (
                    /^[a-z0-9_가-힣]+(,[a-z0-9_가-힣]+)*$/i.test(value) ||
                    "일반문자와 숫자만 사용해서 1글자 이상씩 콤마로 구분해서 입력해주세요."
                  );
                } else if (fieldType === FIELD_TYPE.INTEGER) {
                  return (
                    /^[0-9]+(,[0-9]+)*$/i.test(value) ||
                    "숫자만 사용해서 1글자 이상씩 콤마로 구분해서 입력해주세요."
                  );
                } else {
                  return true;
                }
              },
              exclusive: (value: string) => {
                const splitValues = value.split(",");
                let isExclusive =
                  uniq(splitValues).length === splitValues.length;
                return !isExclusive
                  ? "콤마로 구분된 값이 중복되지 않도록 입력해주세요."
                  : true;
              },
            },
          })}
          variant="outlined"
          fullWidth
          required
          error={!!errors.items}
          helperText={errors.items?.message}
          placeholder="콤마로 구분하여 입력"
        />
      </Box>
      <Box mt={2}>
        <TextField
          name="description"
          label="설명"
          inputRef={register({
            maxLength: {
              value: 80,
              message: "설명이 너무 길어요.",
            },
          })}
          variant="outlined"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
          placeholder="설명"
        />
      </Box>
      <Box mt={2}>
        <Button
          color="secondary"
          disabled={!isSubmittable}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          열거형 생성
        </Button>
      </Box>
    </form>
  ) : null;
};

export default QuickEnumForm;
