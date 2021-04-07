import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import { useForm } from "react-hook-form";
import { registerOptions } from "../../helpers/formHelpers";
import { getTextFieldErrorProps } from "../../helpers/projectHelpers";
import { FieldTypeHasExamples, FIELD_TYPE, ModelFieldDocLike } from "../../types";
import InputItems from "../InputItems";
import Modal from "../Modal";

export enum EXAMPLE_TYPES {
  MODEL_FIELD = "MODEL_FIELD",
  REQUEST_PARAM = "REQUEST_PARAM",
  REQUEST_BODY = "REQUEST_BODY",
  RESPONSE_BODY = "RESPONSE_BODY",
  RESPONSE_HEADER = "RESPONSE_HEADER",
}

export interface ExampleFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  modelField?: ModelFieldDocLike;
  onSubmit: (values: ExampleFormValues) => void;
  isSubmitting: boolean;
  type?: EXAMPLE_TYPES;
}

export interface ExampleFormValues {
  itemInput?: string;
  examples: string[];
  target?: ModelFieldDocLike;
  type?: EXAMPLE_TYPES;
}

export const ExampleFormModal: React.FC<ExampleFormModalProps> = ({
  isVisible,
  onClose,
  modelField,
  onSubmit,
  isSubmitting,
  type,
}) => {
  const defaultValues = useMemo(() => {
    return {
      itemInput: "",
      examples:
        modelField?.examples?.[
          modelField?.fieldType.value as FieldTypeHasExamples
          // @ts-ignore
        ]?.map((item: string | number) => String(item)) || [],
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
        onSubmit({ examples: items, target: modelField, type });
      })();
    },
    [handleSubmit, items, modelField, onSubmit, trigger, type],
  );

  const isModified = useMemo(() => {
    return !isEqual(defaultValues.examples, items);
  }, [defaultValues, items]);

  const isSubmittable = useMemo(() => {
    return !isSubmitting && formState.isValid && isModified;
  }, [formState.isValid, isModified, isSubmitting]);

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
            inputRef={register(
              registerOptions.enumerationForm.itemInput(
                modelField?.fieldType.value || FIELD_TYPE.STRING,
                items,
              ),
            )}
            variant="outlined"
            {...getTextFieldErrorProps(errors.itemInput)}
            placeholder="Enter an example to add"
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
            autoFocus
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
