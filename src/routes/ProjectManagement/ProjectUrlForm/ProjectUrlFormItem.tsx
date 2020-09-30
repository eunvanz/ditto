import React from "react";
import { TableCell, TextField, Box } from "@material-ui/core";
import { UseFormMethods } from "react-hook-form";
import { ProjectUrlFormValues } from "./ProjectUrlForm";
import { regExps } from "../../../helpers/commonHelpers";

export interface ProjectUrlFormItemProps {
  formProps: UseFormMethods<ProjectUrlFormValues>;
  autoFocusField?: keyof ProjectUrlFormValues;
  onBlur: () => void;
  onFocus: () => void;
}

const ProjectUrlFormItem: React.FC<ProjectUrlFormItemProps> = ({
  formProps,
  autoFocusField = "label",
  onBlur,
  onFocus,
}) => {
  const { register, errors } = formProps;

  return (
    <>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "label"}
          name="label"
          inputRef={register({
            required: "이름표를 붙여주세요.",
            maxLength: {
              value: 20,
              message: "이름이 너무 길어요.",
            },
          })}
          fullWidth
          required
          error={!!errors.label}
          helperText={errors.label?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="라벨"
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "url"}
          name="url"
          inputRef={register({
            required: "URL을 입력해주세요.",
            maxLength: {
              value: 200,
              message: "URL이 너무 길어요.",
            },
            pattern: {
              value: regExps.url,
              message: "URL형식으로 입력해주세요.",
            },
          })}
          fullWidth
          required
          error={!!errors.url}
          helperText={errors.url?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="URL"
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "description"}
          name="description"
          inputRef={register({
            maxLength: {
              value: 80,
              message: "설명이 너무 길어요.",
            },
          })}
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="설명"
        />
      </TableCell>
      <TableCell>
        <Box padding={3} />
      </TableCell>
    </>
  );
};

export default ProjectUrlFormItem;
