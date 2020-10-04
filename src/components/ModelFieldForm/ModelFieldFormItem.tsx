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
import { ModelFieldFormValues } from "./ModelFieldForm";
import { fieldTypes, formats, FIELD_TYPE } from "../../types";

const useStyles = makeStyles(() => ({
  autocomplete: {
    "& .MuiAutocomplete-inputRoot": {
      paddingBottom: 0,
    },
  },
}));

export interface ModelFieldFormItemProps {
  formProps: UseFormMethods<ModelFieldFormValues>;
  autoFocusField?: keyof ModelFieldFormValues;
  onBlur: () => void;
  onFocus: () => void;
  defaultValues: ModelFieldFormValues;
}

const ModelFormItem: React.FC<ModelFieldFormItemProps> = ({
  formProps,
  autoFocusField = "fieldName",
  onBlur,
  onFocus,
  defaultValues,
}) => {
  const classes = useStyles();

  const { errors, setValue, watch, control } = formProps;

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
        <Controller
          control={control}
          name="fieldName"
          defaultValue={defaultValues.fieldName}
          rules={{
            required: "필드명을 입력해주세요.",
            maxLength: {
              value: 40,
              message: "너무 긴 필드명은 좋은 생각이 아닌 것 같아요.",
            },
          }}
          render={(props) => (
            <TextField
              {...props}
              size="small"
              autoFocus={autoFocusField === "fieldName"}
              fullWidth
              required
              error={!!errors.fieldName}
              helperText={errors.fieldName?.message}
              onBlur={onBlur}
              onFocus={onFocus}
              placeholder="필드명"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="isRequired"
          render={(props) => (
            <Checkbox
              {...props}
              autoFocus={autoFocusField === "isRequired"}
              defaultChecked={defaultValues.isRequired}
              onBlur={onBlur}
              onFocus={onFocus}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="isArray"
          render={(props) => (
            <Checkbox
              {...props}
              autoFocus={autoFocusField === "isArray"}
              defaultChecked={defaultValues.isArray}
              onBlur={onBlur}
              onFocus={onFocus}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="fieldType"
          defaultValue={defaultValues.fieldType}
          rules={{ required: "타입을 선택해주세요." }}
          render={({ value }) => {
            return (
              <Autocomplete
                value={value}
                openOnFocus
                className={classes.autocomplete}
                options={fieldTypes}
                onChange={(_e, value) => {
                  setValue("fieldType", value, { shouldValidate: true });
                }}
                disableClearable
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      required
                      placeholder="타입"
                      autoFocus={autoFocusField === "fieldType"}
                      error={!!errors.fieldType}
                      helperText={errors.fieldType?.message}
                      onBlur={onBlur}
                      onFocus={onFocus}
                    />
                  );
                }}
              />
            );
          }}
        />
      </TableCell>

      <TableCell>
        <Controller
          control={control}
          name="format"
          defaultValue={defaultValues.format || formatOptions[0]}
          render={({ value, name }) => {
            return (
              <Autocomplete
                value={value}
                openOnFocus
                className={classes.autocomplete}
                options={formatOptions}
                onChange={(_e, value) =>
                  setValue("format", value, { shouldValidate: true })
                }
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus={autoFocusField === "format"}
                    placeholder="포맷"
                    onBlur={onBlur}
                    onFocus={onFocus}
                  />
                )}
              />
            );
          }}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="enum"
          defaultValue={defaultValues.enum}
          render={({ value }) => {
            return (
              <Autocomplete
                value={value}
                openOnFocus
                className={classes.autocomplete}
                options={["없음"]}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus={autoFocusField === "enum"}
                    placeholder="열거형"
                    onBlur={onBlur}
                    onFocus={onFocus}
                  />
                )}
              />
            );
          }}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="description"
          defaultValue={defaultValues.description}
          rules={{
            maxLength: {
              value: 200,
              message: "설명이 너무 길어요.",
            },
          }}
          render={(props) => (
            <TextField
              {...props}
              size="small"
              autoFocus={autoFocusField === "description"}
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              onBlur={onBlur}
              onFocus={onFocus}
              placeholder="설명"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Box padding={3} />
      </TableCell>
    </>
  );
};

export default ModelFormItem;
