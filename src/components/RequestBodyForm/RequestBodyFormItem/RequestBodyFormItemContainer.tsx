import React from "react";
import RequestBodyFormItem, {
  RequestBodyFormItemProps,
} from "./RequestBodyFormItem";
import useRequestBodyFormItemProps from "./useRequestBodyFormItemProps";

export type RequestBodyFormItemContainerProps = Pick<
  RequestBodyFormItemProps,
  "requestBody" | "isNewForm" | "onHideForm"
>;

const RequestBodyFormItemContainer = (
  containerProps: RequestBodyFormItemContainerProps
) => {
  const props = useRequestBodyFormItemProps(containerProps);
  return <RequestBodyFormItem {...props} />;
};

export default RequestBodyFormItemContainer;
