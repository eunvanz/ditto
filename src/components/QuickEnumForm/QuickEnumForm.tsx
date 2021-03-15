import { Box, Button, TextField } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { patterns } from "../../helpers/projectHelpers";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import { EnumerationDoc, FIELD_TYPE } from "../../types";
import uniq from "lodash/uniq";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";

export interface QuickEnumFormProps {
  onSubmit: (values: EnumFormValues) => void;
  isSubmitting: boolean;
  fieldType: FIELD_TYPE.INTEGER | FIELD_TYPE.STRING;
  existingEnumerations?: EnumerationDoc[];
  enumeration?: EnumerationDoc;
}

const QuickEnumForm: React.FC<QuickEnumFormProps> = ({
  onSubmit,
  isSubmitting,
  existingEnumerations,
  fieldType,
  enumeration,
}) => {
  const defaultValues: EnumFormValues = useMemo(
    () => ({
      name: enumeration?.name || "",
      items: enumeration?.items.join(",") || "",
      fieldType,
      description: enumeration?.description || "",
    }),
    [enumeration, fieldType]
  );

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    trigger,
    getValues,
    reset,
  } = useForm<EnumFormValues>({
    mode: "onChange",
    defaultValues,
  });

  useSyncDefaultValues(reset, defaultValues);

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
          label="Enumeration name"
          name="name"
          inputRef={register({
            required: "Enumeration name is required.",
            maxLength: {
              value: 40,
              message: "Enumeration name is too long.",
            },
            validate: (data: string) => {
              const isDup = existingEnumerations.some(
                (item) => item.name === data
              );
              return isDup ? "Enumeration name is duplicated." : true;
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
          label="Values"
          onChange={(e) => {
            const { value } = e.target;
            setValue("items", value.replace(" ", ""));
            trigger();
          }}
          inputRef={register({
            required: "Values are required.",
            maxLength: {
              value: 500,
              message: "Values are too long.",
            },
            validate: {
              pattern: (value) => {
                if (fieldType === FIELD_TYPE.STRING) {
                  return (
                    /^[a-zA-Z0-9_가-힣]+(,[a-zA_Z0-9_가-힣]+)*$/i.test(value) ||
                    "Try a mix of letters, numbers or underscore, separate values with comma."
                  );
                } else if (fieldType === FIELD_TYPE.INTEGER) {
                  return (
                    /^[0-9]+(,[0-9]+)*$/i.test(value) ||
                    "Only numbers are allowed, separate values with comma."
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
                  ? "Each values must not be the same."
                  : true;
              },
            },
          })}
          variant="outlined"
          fullWidth
          required
          error={!!errors.items}
          helperText={errors.items?.message}
          placeholder="Separate values with comma"
        />
      </Box>
      <Box mt={2}>
        <TextField
          name="description"
          label="Description"
          inputRef={register({
            maxLength: {
              value: 80,
              message: "Description is too long.",
            },
          })}
          variant="outlined"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
          placeholder="Description"
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
          {enumeration ? "Apply modification" : "Create new enumeration"}
        </Button>
      </Box>
    </form>
  ) : null;
};

export default QuickEnumForm;
