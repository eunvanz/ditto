import { FieldError } from "react-hook-form";
import { REQUEST_METHOD } from "../types";

export const patterns = {
  wordsWithNoSpace: {
    value: /^[\w-/]+\S$/,
    message:
      "Try a mix of letters or numbers more than 2 characters with no spaces.",
  },
};

export const getIndentionPaddingByDepth = (depth?: number) => {
  return depth ? depth * 16 : undefined;
};

export const getButtonIndentionPaddingByDepth = (depth?: number) => {
  return depth ? depth * 16 - 16 : undefined;
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

export const methodOptions = [
  REQUEST_METHOD.GET,
  REQUEST_METHOD.POST,
  REQUEST_METHOD.PUT,
  REQUEST_METHOD.PATCH,
  REQUEST_METHOD.DELETE,
];
