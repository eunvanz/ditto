import React from "react";
import ModelForm, { ModelFormModal } from "./ModelForm";
import useModelFormProps from "./useModelFormProps";

export interface ModelFormContainerProps {
  defaultModelId?: string;
  isVisible?: boolean;
  onClose?: () => void;
  depth?: number;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({
  defaultModelId,
  isVisible,
  onClose,
  depth,
}) => {
  const props = useModelFormProps(defaultModelId);

  return onClose ? (
    <ModelFormModal
      isVisible={isVisible || false}
      onClose={onClose}
      {...props}
    />
  ) : (
    <ModelForm depth={depth} {...props} />
  );
};

export default ModelFormContainer;
