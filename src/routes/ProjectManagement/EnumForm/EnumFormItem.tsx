import React, { useCallback, useEffect } from "react";
import { Box, IconButton, SvgIcon, TableCell, TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Controller, UseFormMethods } from "react-hook-form";
import { registerOptions } from "../../../helpers/formHelpers";
import { EnumerationDoc, FIELD_TYPE } from "../../../types";
import { EnumFormValues } from "./EnumForm";

export interface EnumFormItemProps {
  formProps: UseFormMethods<EnumFormValues>;
  autoFocusField?: keyof EnumFormValues;
  onSubmit: (data: EnumFormValues) => void;
  onCancel: () => void;
  defaultFieldType?: FIELD_TYPE;
  existingEnumerations: EnumerationDoc[];
}

const EnumFormItem: React.FC<EnumFormItemProps> = ({
  formProps,
  autoFocusField,
  onSubmit,
  onCancel,
  defaultFieldType = FIELD_TYPE.STRING,
  existingEnumerations,
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
    [handleOnCancel, handleOnSubmit],
  );

  useEffect(() => {
    window.addEventListener("keyup", handleOnPressKey);
    return () => {
      window.removeEventListener("keyup", handleOnPressKey);
    };
  }, [handleOnPressKey]);

  return (
    <>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "name"}
          name="name"
          inputRef={register(registerOptions.enumerationForm.name(existingEnumerations))}
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name?.message}
          placeholder="Enumeration name"
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="fieldType"
          defaultValue={defaultFieldType}
          rules={{ required: "Type must be selected." }}
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
                      placeholder="Type"
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
          onChange={(e) => {
            const { value } = e.target;
            setValue("items", value.replace(" ", ""));
            trigger();
          }}
          inputRef={register(registerOptions.enumerationForm.items(watchedFieldType))}
          fullWidth
          required
          error={!!errors.items}
          helperText={errors.items?.message}
          placeholder="Separate values with comma"
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "description"}
          name="description"
          inputRef={register(registerOptions.enumerationForm.description)}
          fullWidth
          required
          error={!!errors.description}
          helperText={errors.description?.message}
          placeholder="Description"
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
