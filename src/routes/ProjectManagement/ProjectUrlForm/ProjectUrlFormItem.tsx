import React from "react";
import { TableCell, TextField, Box } from "@material-ui/core";
import { UseFormMethods } from "react-hook-form";
import { ProjectUrlFormValues } from "./ProjectUrlForm";
import { regExps } from "../../../helpers/commonHelpers";
import { ProjectUrlDoc } from "../../../types";

export interface ProjectUrlFormItemProps {
  formProps: UseFormMethods<ProjectUrlFormValues>;
  autoFocusField?: keyof ProjectUrlFormValues;
  onBlur: () => void;
  onFocus: () => void;
  existingUrls: ProjectUrlDoc[];
}

const ProjectUrlFormItem: React.FC<ProjectUrlFormItemProps> = ({
  formProps,
  autoFocusField = "label",
  onBlur,
  onFocus,
  existingUrls,
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
            validate: (data: string) => {
              const isDup = existingUrls.some((item) => item.label === data);
              return isDup ? "중복되는 이름이 있어요." : true;
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
              value: 100,
              message: "URL이 너무 길어요.",
            },
            pattern: {
              value: regExps.url,
              message: "URL형식으로 입력해주세요.",
            },
            validate: (data: string) => {
              const dupUrl = existingUrls.find((item) => item.url === data);
              return dupUrl ? `이미 등록된 URL이에요. - ${dupUrl.label}` : true;
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
              value: 100,
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
