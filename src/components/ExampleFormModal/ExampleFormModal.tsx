import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import { useForm } from "react-hook-form";
import { getTextFieldErrorProps } from "../../helpers/projectHelpers";
import { ModelFieldDoc } from "../../types";
import InputItems from "../InputItems";
import Modal from "../Modal";

export interface ExampleFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  modelField?: ModelFieldDoc;
  onSubmit: (values: ExampleFormValues) => void;
  isSubmitting: boolean;
}

export interface ExampleFormValues {
  itemInput?: string;
  examples: string[];
}

export const ExampleFormModal: React.FC<ExampleFormModalProps> = ({
  isVisible,
  onClose,
  modelField,
  onSubmit,
  isSubmitting,
}) => {
  const defaultValues = useMemo(() => {
    return {
      itemInput: "",
      // @ts-ignore
      examples: modelField.examples?.map((item: string | number) => String(item)) || [],
    };
  }, [modelField]);

  const {
    register,
    errors,
    trigger,
    setValue,
    getValues,
    formState,
    handleSubmit,
  } = useForm<ExampleFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const [items, setItems] = useState<string[]>(defaultValues.examples);

  const handleOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      trigger();
      await handleSubmit(() => {
        onSubmit({ examples: items });
      })();
    },
    [handleSubmit, items, onSubmit, trigger],
  );

  const isModified = useMemo(() => {
    return !isEqual(defaultValues, {
      examples: items,
    });
  }, [defaultValues, items]);

  const isSubmittable = useMemo(() => {
    return !isSubmitting && formState.isValid && items.length && isModified;
  }, [formState.isValid, isModified, isSubmitting, items.length]);

  useEffect(() => {
    if (defaultValues.examples) {
      setItems(defaultValues.examples);
    }
  }, [defaultValues.examples]);

  return (
    <Modal title="Example data" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleOnSubmit} noValidate>
        <Box>
          <InputItems
            name="itemInput"
            items={items}
            label="Data"
            inputRef={register}
            variant="outlined"
            {...getTextFieldErrorProps(errors.itemInput)}
            placeholder="Enter an example data to add"
            onAddItem={async () => {
              const isValid = await trigger("itemInput");
              const value = getValues().itemInput;
              if (isValid && value) {
                setItems((items) => [...items, value]);
                setValue("itemInput", "");
              }
            }}
            onDeleteItem={(itemToDelete) =>
              setItems((items) => items.filter((item) => item !== itemToDelete))
            }
            fullWidth
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
            Save
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default ExampleFormModal;
