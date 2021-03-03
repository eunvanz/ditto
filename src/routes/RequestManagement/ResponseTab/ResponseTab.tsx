import { Box, Button, makeStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import ResponseBodyForm from "../../../components/ResponseBodyForm";
import ResponseStatusFormModal from "../../../components/ResponseStatusFormModal";
import {
  ResponseStatusFormModalProps,
  ResponseStatusFormValues,
} from "../../../components/ResponseStatusFormModal/ResponseStatusFormModal";
import { Theme } from "../../../theme";
import { ResponseStatusDoc } from "../../../types";

const useStyles = makeStyles((_theme: Theme) => ({
  addButton: {
    justifyContent: "start",
    textTransform: "unset",
  },
}));

export interface ResponseTabProps {
  responseStatuses: ResponseStatusDoc[];
  onSubmitResponseStatusForm: (values: ResponseStatusFormValues) => void;
  isSubmittingResponseStatusForm: boolean;
}

const ResponseTab: React.FC<ResponseTabProps> = ({
  responseStatuses,
  onSubmitResponseStatusForm,
  isSubmittingResponseStatusForm,
}) => {
  const classes = useStyles();

  const [
    responseStatusFormModalState,
    setResponseStatusFormModalState,
  ] = useState<
    Pick<
      ResponseStatusFormModalProps,
      "isVisible" | "existingStatusCodes" | "defaultValues"
    >
  >({
    isVisible: false,
    existingStatusCodes: [],
    defaultValues: undefined,
  });

  const closeResponseStatusFormModal = useCallback(() => {
    setResponseStatusFormModalState((state) => ({
      ...state,
      isVisible: false,
    }));
  }, []);

  const showResponseStatusFormModal = useCallback(
    (responseStatus?: ResponseStatusDoc) => {
      if (responseStatus) {
        setResponseStatusFormModalState({
          isVisible: true,
          existingStatusCodes: responseStatuses
            .filter((item) => item.statusCode !== responseStatus.statusCode)
            .map((item) => item.statusCode),
          defaultValues: {
            statusCode: responseStatus.statusCode,
            description: responseStatus.description || "",
            target: responseStatus,
          },
        });
      } else {
        setResponseStatusFormModalState({
          isVisible: true,
          existingStatusCodes: responseStatuses.map((item) => item.statusCode),
          defaultValues: undefined,
        });
      }
    },
    [responseStatuses]
  );

  useEffect(() => {
    if (isSubmittingResponseStatusForm) {
      return closeResponseStatusFormModal;
    }
  }, [closeResponseStatusFormModal, isSubmittingResponseStatusForm]);

  return (
    <>
      {responseStatuses.map((item) => (
        <Box mt={3}>
          <ResponseBodyForm
            responseStatus={item}
            onEditResponseStatus={() => showResponseStatusFormModal(item)}
          />
        </Box>
      ))}
      <Box mt={3}>
        <Button
          className={classes.addButton}
          variant="outlined"
          color="secondary"
          fullWidth
          size="large"
          onClick={() => showResponseStatusFormModal()}
        >
          <Add /> ADD NEW STATUS CODE
        </Button>
      </Box>
      <ResponseStatusFormModal
        isVisible={responseStatusFormModalState.isVisible}
        existingStatusCodes={responseStatusFormModalState.existingStatusCodes}
        defaultValues={responseStatusFormModalState.defaultValues}
        onSubmit={onSubmitResponseStatusForm}
        isSubmitting={isSubmittingResponseStatusForm}
        onClose={closeResponseStatusFormModal}
      />
    </>
  );
};

export default ResponseTab;
