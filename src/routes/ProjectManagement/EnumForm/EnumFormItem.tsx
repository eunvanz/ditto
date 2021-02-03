import {
  Box,
  IconButton,
  SvgIcon,
  TableCell,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useCallback, useEffect } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { FIELD_TYPE } from "../../../types";
import { EnumFormValues } from "./EnumForm";

export interface EnumFormItemProps {
  formProps: UseFormMethods<EnumFormValues>;
  autoFocusField?: keyof EnumFormValues;
  onSubmit: (data: EnumFormValues) => void;
  onCancel: () => void;
  defaultFieldType?: FIELD_TYPE;
}

const EnumFormItem: React.FC<EnumFormItemProps> = ({
  formProps,
  autoFocusField,
  onSubmit,
  onCancel,
  defaultFieldType = FIELD_TYPE.STRING,
}) => {
  const {
    register,
    errors,
    watch,
    trigger,
    handleSubmit,
    reset,
    control,
    setValue,
    formState,
  } = formProps;

  const watchedFieldType = watch("fieldType");

  const handleOnSubmit = useCallback(async () => {
    trigger();
    await handleSubmit((data) => {
      onSubmit(data);
    })();
  }, [handleSubmit, onSubmit, trigger]);

  const handleOnCancel = useCallback(() => {
    onCancel();
    reset();
  }, [onCancel, reset]);

  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleOnSubmit();
      } else if (e.key === "Escape") {
        handleOnCancel();
      }
    },
    [handleOnCancel, handleOnSubmit]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleOnPressKey);
    return () => {
      window.removeEventListener("keyup", handleOnPressKey);
    };
  }, [handleOnPressKey]);

  useEffect(() => {
    if (formState.isDirty) {
      trigger("items");
    }
  }, [formState.isDirty, trigger, watchedFieldType]);

  return (
    <>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "name"}
          name="name"
          inputRef={register({
            required: "이름을 지어주세요.",
            maxLength: {
              value: 40,
              message: "이름이 너무 길어요.",
            },
          })}
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name?.message}
          placeholder="열거형 명"
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="fieldType"
          defaultValue={defaultFieldType}
          rules={{ required: "타입을 선택해주세요." }}
          render={({ value }) => {
            return (
              <Autocomplete
                value={value}
                openOnFocus
                options={[FIELD_TYPE.STRING, FIELD_TYPE.INTEGER]}
                disableClearable
                onChange={(_e, value) => {
                  setValue("fieldType", value, { shouldValidate: true });
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      size="small"
                      required
                      placeholder="타입"
                      autoFocus={autoFocusField === "fieldType"}
                      error={!!errors.fieldType}
                      helperText={errors.fieldType?.message}
                    />
                  );
                }}
              />
            );
          }}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "items"}
          name="items"
          inputRef={register({
            required: "값을 입력해주세요.",
            maxLength: {
              value: 500,
              message: "이렇게 많이 쓸일이 있을까요?",
            },
            validate: {
              pattern: (value) => {
                if (watchedFieldType === FIELD_TYPE.STRING) {
                  return (
                    /^[a-z0-9]+(,[a-z0-9]+)*$/i.test(value) ||
                    "영문과 숫자만 사용해서 1글자 이상씩 콤마로 구분해서 입력해주세요."
                  );
                } else if (watchedFieldType === FIELD_TYPE.INTEGER) {
                  return (
                    /^[0-9]+(,[0-9]+)*$/i.test(value) ||
                    "숫자만 사용해서 1글자 이상씩 콤마로 구분해서 입력해주세요."
                  );
                } else {
                  return true;
                }
              },
            },
            setValueAs: (value) => value.replace(/" "/g, ""),
          })}
          fullWidth
          required
          error={!!errors.items}
          helperText={errors.items?.message}
          placeholder="콤마로 구분하여 입력"
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "description"}
          name="description"
          inputRef={register({
            maxLength: {
              value: 80,
              message: "설명이 너무 길어요.",
            },
          })}
          fullWidth
          required
          error={!!errors.description}
          helperText={errors.description?.message}
          placeholder="설명"
        />
      </TableCell>
      <TableCell align="right">
        <Box>
          <IconButton onClick={handleOnSubmit}>
            <SvgIcon fontSize="small">
              <CheckIcon />
            </SvgIcon>
          </IconButton>
          <IconButton onClick={handleOnCancel}>
            <SvgIcon fontSize="small">
              <ClearIcon />
            </SvgIcon>
          </IconButton>
        </Box>
      </TableCell>
    </>
  );
};

export default EnumFormItem;
