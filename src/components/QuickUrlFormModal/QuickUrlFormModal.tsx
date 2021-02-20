import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { regExps } from "../../helpers/commonHelpers";
import { getTextFieldErrorProps } from "../../helpers/projectHelpers";
import { ProjectUrlFormValues } from "../../routes/ProjectManagement/ProjectUrlForm/ProjectUrlForm";
import { ProjectUrlDoc } from "../../types";
import Modal from "../Modal";

export interface QuickUrlFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectUrlFormValues) => void;
  isSubmitting: boolean;
  existingUrls: ProjectUrlDoc[];
}

const QuickUrlFormModal: React.FC<QuickUrlFormModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting,
  existingUrls,
}) => {
  const { handleSubmit, register, errors, formState } = useForm<
    ProjectUrlFormValues
  >({
    mode: "onChange",
  });

  return (
    <Modal title="새로운 베이스 URL" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mt={2}>
          <TextField
            autoFocus
            label="라벨"
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
            variant="outlined"
            fullWidth
            required
            {...getTextFieldErrorProps(errors.label)}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="URL"
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
                return dupUrl
                  ? `이미 등록된 URL이에요. - ${dupUrl.label}`
                  : true;
              },
            })}
            variant="outlined"
            fullWidth
            required
            {...getTextFieldErrorProps(errors.url)}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="설명"
            name="description"
            inputRef={register({
              maxLength: {
                value: 100,
                message: "설명이 너무 길어요.",
              },
            })}
            variant="outlined"
            fullWidth
            {...getTextFieldErrorProps(errors.description)}
          />
        </Box>
        <Box mt={2}>
          <Button
            color="secondary"
            disabled={isSubmitting || !formState.isValid}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            베이스 URL 생성
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default QuickUrlFormModal;
