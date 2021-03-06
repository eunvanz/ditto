import {
  Box,
  Card,
  Chip,
  Container,
  Divider,
  makeStyles,
  Tab,
  Tabs,
} from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import Header from "../../components/Header";
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
    marginLeft: theme.spacing(1),
  },
}));

export interface RequestManagementViewProps {
  request: RequestDoc;
}

const RequestManagementView: React.FC<RequestManagementViewProps> = ({
  request,
}) => {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState("request");

  const tabs = useMemo(() => {
    return [
      { value: "request", label: "Request" },
      { value: "response", label: "Response" },
      { value: "settings", label: "Settings" },
    ];
  }, []);

  const handleOnTabChange = useCallback((_, value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <Container className={classes.root} maxWidth="lg">
      <Header
        title={
          <>
            {request.name}
            {request.operationId && (
              <Chip
                size="small"
                color="secondary"
                label={request.operationId}
                className={classes.operationIdChip}
              />
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
