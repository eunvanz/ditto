import React, { useCallback, useState, useMemo } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Header from "./Header";
import { ProjectDoc } from "../../types";
import ProjectBasicForm from "./ProjectBasicForm";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export interface ProjectManagementViewProps {
  project: ProjectDoc;
}

const ProjectManagementView: React.FC<ProjectManagementViewProps> = ({
  project,
}) => {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState("basic");

  const tabs = useMemo(() => {
    return [
      { value: "basic", label: "기본정보" },
      { value: "url", label: "URL관리" },
      { value: "member", label: "맴버관리" },
      { value: "model", label: "모델관리" },
    ];
  }, []);

  const handleOnTabChange = useCallback((_, value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <Container className={classes.root} maxWidth="lg">
      <Header title={project.title} description={project.description} />
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
        {activeTab === "basic" && <ProjectBasicForm project={project} />}
        {/* {activeTab === 'url' && <Subscription />}
          {activeTab === 'member' && <Notifications />}
          {activeTab === 'model' && <Security />} */}
      </Box>
    </Container>
  );
};

export default ProjectManagementView;
