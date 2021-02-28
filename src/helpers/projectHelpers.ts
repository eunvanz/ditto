import { FieldError } from "react-hook-form";

export const patterns = {
  wordsWithNoSpace: {
    value: /^\w+\S$/,
    message:
      "Try a mix of letters or numbers more than 2 characters with no spaces.",
  },
};

export const getIntentionPaddingByDepth = (depth?: number) => {
  return depth ? depth * 16 : undefined;
};

export const getTextFieldErrorProps = (error?: FieldError) => ({
  error: !!error,
  helperText: error?.message,
});
