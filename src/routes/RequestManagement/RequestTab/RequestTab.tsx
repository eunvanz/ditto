import { Box } from "@material-ui/core";
import React from "react";
import RequestParamForm from "../../../components/RequestParamForm";
import { REQUEST_PARAM_LOCATION } from "../../../types";

export interface RequestTabProps {}

const RequestTab: React.FC<RequestTabProps> = (_: RequestTabProps) => {
  return (
    <>
      <Box>
        <RequestParamForm location={REQUEST_PARAM_LOCATION.PATH} />
      </Box>
      <Box mt={3}>
        <RequestParamForm location={REQUEST_PARAM_LOCATION.QUERY} />
      </Box>
      <Box mt={3}>
        <RequestParamForm location={REQUEST_PARAM_LOCATION.HEADER} />
      </Box>
      <Box mt={3}>
        <RequestParamForm location={REQUEST_PARAM_LOCATION.COOKIE} />
      </Box>
    </>
  );
};

export default RequestTab;
