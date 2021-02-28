import React, { useCallback, useState, useMemo } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Header from "../../components/Header";
import { ProjectDoc } from "../../types";
import ProjectBasicForm from "./ProjectBasicForm";
import { Theme } from "../../theme";
import ProjectUrlForm from "./ProjectUrlForm";
import ModelList from "./ModelList";
import EnumForm from "./EnumForm";

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
      { value: "basic", label: "Basic" },
      { value: "urls", label: "Base URLs" },
      { value: "members", label: "Members" },
      { value: "models", label: "Models" },
      { value: "enums", label: "Enumerations" },
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
        {activeTab === "basic" && <ProjectBasicForm />}
        {activeTab === "urls" && <ProjectUrlForm />}
        {/* {activeTab === 'members' && <Notifications />} */}
        {activeTab === "models" && <ModelList />}
        {activeTab === "enums" && <EnumForm />}
      </Box>
    </Container>
  );
};

export default ProjectManagementView;
