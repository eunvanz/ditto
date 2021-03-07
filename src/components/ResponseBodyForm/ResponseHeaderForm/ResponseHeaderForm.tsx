import React from "react";
import {
  ModelFieldDoc,
  REQUEST_PARAM_LOCATION,
  ResponseHeaderDoc,
} from "../../../types";
import { ModelFieldFormValues } from "../../ModelForm/ModelForm";
import RequestParamForm from "../../RequestParamForm/RequestParamForm";

export interface ResponseHeaderFormProps {
  responseHeaders?: ResponseHeaderDoc[];
  onSubmit: (values: ModelFieldFormValues) => void;
  onDelete: (responseHeader: ModelFieldDoc) => void;
  checkIsSubmitting: (id?: string) => boolean;
}

const ResponseHeaderForm: React.FC<ResponseHeaderFormProps> = ({
  responseHeaders,
  onSubmit,
  onDelete,
  checkIsSubmitting,
}) => {
  return (
    <RequestParamForm
      location={REQUEST_PARAM_LOCATION.HEADER}
      requestParams={responseHeaders}
      onSubmitRequestParamForm={onSubmit}
      onDeleteRequestParam={onDelete}
      checkIsSubmittingRequestParam={checkIsSubmitting}
    />
  );
};

export default ResponseHeaderForm;
