import { Box, Button, TextField } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import { EnumerationDoc, FIELD_TYPE } from "../../types";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";
import { registerOptions } from "../../helpers/formHelpers";

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
    [enumeration, fieldType],
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
    [fieldType, getValues, handleSubmit, onSubmit, trigger],
  );

  return existingEnumerations ? (
    <form onSubmit={handleOnSubmit} noValidate>
      <Box mt={2}>
        <TextField
          autoFocus
          label="Enumeration name"
          name="name"
          inputRef={register(registerOptions.enumerationForm.name(existingEnumerations))}
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
          inputRef={register(registerOptions.enumerationForm.items(fieldType))}
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
          inputRef={register(registerOptions.enumerationForm.description)}
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
