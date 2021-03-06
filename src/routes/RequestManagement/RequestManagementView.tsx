import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Container,
  Divider,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import qs from "query-string";
import { Helmet } from "react-helmet";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { SCREEN_MODE } from "../../store/Ui/UiSlice";
import { Theme } from "../../theme";
import { RequestDoc } from "../../types";
import RequestTab from "./RequestTab";
import RequestUrlForm from "./RequestUrlForm";
import ResponseTab from "./ResponseTab";
import SettingsTab from "./SettingsTab";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  operationIdChip: {
    marginLeft: theme.spacing(2),
  },
  operation: {
    marginLeft: theme.spacing(1),
  },
}));

export interface RequestManagementViewProps {
  request: RequestDoc;
  screenMode: SCREEN_MODE;
}

const RequestManagementView: React.FC<RequestManagementViewProps> = ({
  request,
  screenMode,
}) => {
  const classes = useStyles();

  const location = useLocation();

  const history = useHistory();

  const tabQuery = useMemo(() => {
    return qs.parse(location.search).tab;
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(tabQuery || "request");

  const tabs = useMemo(() => {
    return [
      { value: "request", label: "Request" },
      { value: "response", label: "Response" },
      { value: "settings", label: "Settings" },
    ];
  }, []);

  const handleOnTabChange = useCallback(
    (_, value: string) => {
      history.replace(`?tab=${value}`);
    },
    [history],
  );

  useEffect(() => {
    if (tabQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  return (
    <Container
      className={classes.root}
      maxWidth={screenMode === SCREEN_MODE.WIDE ? "xl" : "lg"}
    >
      <Helmet>
        <title>{request.name} - Diitto</title>
      </Helmet>
      <Header
        title={
          <>
            {request.name}
            {request.operationId && (
              <Typography
                variant="subtitle2"
                component="span"
                color="textSecondary"
                className={classes.operation}
              >
                - {request.operationId}
              </Typography>
            )}
          </>
        }
        description={request.description}
      />
      <Box mt={3}>
        <Card>
          <RequestUrlForm />
        </Card>
      </Box>
      <Box mt={3}>
        <Tabs
          onChange={handleOnTabChange}
          scrollButtons="auto"
          value={activeTab}
          variant="scrollable"
          textColor="secondary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>
      <Divider />
      <Box mt={3}>
        {activeTab === "request" && <RequestTab />}
        {activeTab === "response" && <ResponseTab />}
        {activeTab === "settings" && <SettingsTab />}
      </Box>
    </Container>
  );
};

export default RequestManagementView;
