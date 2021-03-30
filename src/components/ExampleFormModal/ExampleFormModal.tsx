import React, { useCallback, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { ModelFieldDoc } from "../../types";
import InputItems from "../InputItems";
import Modal from "../Modal";

export interface ExampleFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  modelField: ModelFieldDoc;
}

export interface ExampleFormValues {
  examples: string[] | number[];
}

export const ExampleFormModal: React.FC<ExampleFormModalProps> = ({
  isVisible,
  onClose,
  modelField,
}) => {
  const defaultValues = useMemo(() => {
    return {
      itemInput: "",
      examples: modelField.examples || [],
    };
  }, [modelField.examples]);

  const form = useForm<ExampleFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const handleOnSubmit = useCallback(() => {}, []);

  const [items, setItems] = useState(defaultValues.examples);

  return (
    <Modal title="Example data" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleOnSubmit} noValidate>
        <Box mt={2}>
          <InputItems name="itemInput" items={items} />
        </Box>
      </form>
    </Modal>
  );
};

export default ExampleFormModal;
