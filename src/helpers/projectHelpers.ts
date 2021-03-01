import { FieldError } from "react-hook-form";

export const patterns = {
  wordsWithNoSpace: {
    value: /^[\w-/]+\S$/,
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

export const mediaTypes = [
  "application/json",
  "application/xml",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain; charset=utf-8",
  "text/html",
  "application/pdf",
  "image/png",
];
