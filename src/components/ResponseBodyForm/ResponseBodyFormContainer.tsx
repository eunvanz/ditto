import React from "react";
import { ResponseStatusDoc } from "../../types";
import ResponseBodyForm from "./ResponseBodyForm";
import useResponseBodyFormProps from "./useResponseBodyFormProps";

export interface ResponseBodyFormContainerProps {
  responseStatus: ResponseStatusDoc;
  onEditResponseStatus: () => void;
}

const ResponseBodyFormContainer = (containerProps: ResponseBodyFormContainerProps) => {
  const props = useResponseBodyFormProps(containerProps);
  return <ResponseBodyForm {...props} />;
};

export default ResponseBodyFormContainer;
