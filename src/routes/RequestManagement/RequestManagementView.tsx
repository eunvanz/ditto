import { Box, Container, makeStyles, Tab, Tabs } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import Header from "../../components/Header";
import { Theme } from "../../theme";
import { RequestDoc } from "../../types";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
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
      { value: "request", label: "요청" },
      { value: "response", label: "응답" },
      { value: "settings", label: "설정" },
    ];
  }, []);

  const handleOnTabChange = useCallback((_, value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <Container className={classes.root} maxWidth="lg">
      <Header title={request.name} description={request.summary} />
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
      <Box mt={3}></Box>
    </Container>
  );
};

export default RequestManagementView;