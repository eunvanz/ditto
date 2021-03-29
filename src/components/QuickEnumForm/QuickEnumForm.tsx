import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { registerOptions } from "../../helpers/formHelpers";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import { EnumerationDoc, FIELD_TYPE } from "../../types";
import InputItems from "../InputItems";

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
      // @ts-ignore
      items: enumeration?.items?.map((item) => String(item)) || [],
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

  const [items, setItems] = useState(defaultValues.items);

  const isSubmittable = useMemo(() => {
    return !isSubmitting && formState.isValid && items.length;
  }, [formState.isValid, isSubmitting, items.length]);
  
  const handleOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (items.length === 0) {
        return
      }
      trigger();
      const values = getValues()
      delete values.itemInput
      await handleSubmit(() => {
        onSubmit({ ...getValues(), fieldType, items });
      })();
    },
    [fieldType, getValues, handleSubmit, items, onSubmit, trigger],
  );


  useEffect(() => {
    if (defaultValues.items) {
      setItems(defaultValues.items)
    }
  }, [defaultValues.items]);

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
        <InputItems
          name="itemInput"
          items={items}
          label="Values"
          inputRef={register(registerOptions.enumerationForm.itemInput(fieldType, items))}
          onChange={(e) => {
            const { value } = e.target;
            setValue("itemInput", value.replace(" ", ""));
            trigger("itemInput");
          }}
          error={!!errors.itemInput}
          helperText={errors.itemInput?.message}
          placeholder="Enter an item to add"
          onAddItem={async () => {
            const isValid = await trigger("itemInput")
            const value = getValues().itemInput
            if (isValid && value) {
              setItems((items) => [...items, value])
              setValue("itemInput", "")
            }
          }}
          onDeleteItem={(itemToDelete) => setItems((items) => items.filter((item) => item !== itemToDelete))}
          required
          fullWidth
          variant="outlined"
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
