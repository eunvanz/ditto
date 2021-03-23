import React from "react";
import { TableCell, TextField, Box } from "@material-ui/core";
import { UseFormMethods } from "react-hook-form";
import { regExps } from "../../../helpers/commonHelpers";
import { ProjectUrlDoc } from "../../../types";
import { ProjectUrlFormValues } from "./ProjectUrlForm";

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
            required: "Label is required.",
            maxLength: {
              value: 20,
              message: "Label is too long.",
            },
            validate: (data: string) => {
              const isDup = existingUrls.some((item) => item.label === data);
              return isDup ? "Label is duplicated." : true;
            },
          })}
          fullWidth
          required
          error={!!errors.label}
          helperText={errors.label?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="Label"
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          autoFocus={autoFocusField === "url"}
          name="url"
          inputRef={register({
            required: "URL is required.",
            maxLength: {
              value: 100,
              message: "URL is too long.",
            },
            pattern: {
              value: regExps.url,
              message: "URL is not valid.",
            },
            validate: (data: string) => {
              const dupUrl = existingUrls.find((item) => item.url === data);
              return dupUrl ? `URL is duplicated with ${dupUrl.label}` : true;
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
              message: "Description is too long.",
            },
          })}
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder="Description"
        />
      </TableCell>
      <TableCell>
        <Box padding={3} />
      </TableCell>
    </>
  );
};

export default ProjectUrlFormItem;
