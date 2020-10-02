import React, { useMemo, useEffect } from "react";
import {
  TableCell,
  TextField,
  Box,
  makeStyles,
  Checkbox,
} from "@material-ui/core";
import { UseFormMethods, Controller } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ModelFormValues } from "./ModelForm";
import { fieldTypes, formats, FIELD_TYPE } from "../../types";

const useStyles = makeStyles(() => ({
  autocomplete: {
    "& .MuiAutocomplete-inputRoot": {
      paddingBottom: 0,
    },
  },
}));

export interface ModelFormItemProps {
  formProps: UseFormMethods<ModelFormValues>;
  autoFocusField?: keyof ModelFormValues;
  onBlur: () => void;
  onFocus: () => void;
}

const ModelFormItem: React.FC<ModelFormItemProps> = ({
  formProps,
  autoFocusField = "label",
  onBlur,
  onFocus,
}) => {
  const classes = useStyles();

  const { register, errors, setValue, watch, control } = formProps;

  const watchedFieldType = watch("fieldType");

  const formatOptions = useMemo(() => {
    if (watchedFieldType) {
      return formats[watchedFieldType as FIELD_TYPE];
    }
    return ["없음"];
  }, [watchedFieldType]);

  useEffect(() => {
    setValue("format", formatOptions[0], { shouldValidate: true });
  }, [formatOptions, setValue]);

  return (
    <>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "fieldName"}
          name="fieldName"
          inputRef={register({
            required: "필드명을 입력해주세요.",
            maxLength: {
              value: 80,
              message: "너무 긴 필드명은 좋지 않은 생각인 것 같아요.",
            },
          })}
          fullWidth
          required
          error={!!errors.fieldName}
          helperText={errors.fieldName?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="필드명"
        />
      </TableCell>
      <TableCell>
        <Checkbox inputRef={register} name="isRequired" defaultChecked />
      </TableCell>
      <TableCell>
        <Autocomplete
          openOnFocus
          className={classes.autocomplete}
          options={fieldTypes}
          onChange={(_e, option) => {
            setValue("fieldType", option, { shouldValidate: true });
          }}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              required
              placeholder="타입"
              error={!!errors.fieldType}
              helperText={errors.fieldType?.message}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="format"
          defaultValue={formatOptions[0]}
          render={({ value }) => {
            return (
              <Autocomplete
                value={value}
                openOnFocus
                className={classes.autocomplete}
                options={formatOptions}
                onInputChange={(_e, value) =>
                  setValue("format", value, { shouldValidate: true })
                }
                onChange={(_e, value) =>
                  setValue("format", value, { shouldValidate: true })
                }
                disableClearable
                renderInput={(params) => (
                  <TextField {...params} placeholder="포맷" />
                )}
              />
            );
          }}
        />
      </TableCell>
      <TableCell>
        <Autocomplete
          openOnFocus
          className={classes.autocomplete}
          options={["없음"]}
          disableClearable
          defaultValue={"없음"}
          renderInput={(params) => (
            <TextField {...params} placeholder="열거형" />
          )}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "description"}
          name="description"
          inputRef={register({
            maxLength: {
              value: 200,
              message: "설명이 너무 길어요.",
            },
          })}
          fullWidth
          required
          error={!!errors.description}
          helperText={errors.description?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="설명"
        />
      </TableCell>
      <TableCell>
        <Box padding={3} />
      </TableCell>
    </>
  );
};

export default ModelFormItem;
