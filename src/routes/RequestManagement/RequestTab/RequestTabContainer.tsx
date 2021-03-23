import React from "react";
import { useSelector } from "react-redux";
import useLoading from "../../../hooks/useLoading";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useRequestByParam from "../../../hooks/useRequestByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import RequestTab from "./RequestTab";

const RequestTabContainer = () => {
  const { projectId } = useProjectByParam();
  const { requestId } = useRequestByParam();

  const requestParams = useSelector(
    FirebaseSelectors.createRequestParamsSelector(projectId, requestId),
  );

  useLoading(requestParams, `loadingRequestParams-${requestId}`);

  return <RequestTab />;
};

export default RequestTabContainer;
