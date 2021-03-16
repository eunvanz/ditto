import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { MemberRole, ProjectDoc } from "../../types";
import ProjectBasicForm from "./ProjectBasicForm";
import { Theme } from "../../theme";
import ProjectUrlForm from "./ProjectUrlForm";
import ModelList from "./ModelList";
import EnumForm from "./EnumForm";
import MembersTab from "./MembersTab";
import { checkHasAuthorization } from "../../helpers/projectHelpers";
import { SCREEN_MODE } from "../../store/Ui/UiSlice";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";

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
  role: MemberRole;
  screenMode: SCREEN_MODE;
}

const ProjectManagementView: React.FC<ProjectManagementViewProps> = ({
  project,
  role,
  screenMode,
}) => {
  const classes = useStyles();

  const location = useLocation();

  const history = useHistory();

  const tabQuery = useMemo(() => {
    return qs.parse(location.search).tab;
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(tabQuery || "basic");

  const tabs = useMemo(() => {
    return [
      { value: "basic", label: "Basic" },
      { value: "urls", label: "Base URLs" },
      { value: "members", label: "Members" },
      { value: "models", label: "Models" },
      { value: "enums", label: "Enumerations" },
    ];
  }, []);

  const handleOnTabChange = useCallback(
    (_, value: string) => {
      history.replace(`?tab=${value}`);
    },
    [history]
  );

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

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
        <title>{project.title} - Diitto</title>
      </Helmet>
      <Header title={project.title} description={project.description} />
      <Box mt={3}>
        <Tabs
          onChange={handleOnTabChange}
          scrollButtons="auto"
          value={activeTab}
          variant="scrollable"
          textColor="secondary"
        >
          {tabs
            .filter((tab) =>
              hasManagerAuthorization ? true : tab.value !== "members"
            )
            .map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
        </Tabs>
      </Box>
      <Divider />
      <Box mt={3}>
        {activeTab === "basic" && <ProjectBasicForm />}
        {activeTab === "urls" && <ProjectUrlForm />}
        {activeTab === "members" && project && <MembersTab />}
        {activeTab === "models" && project && <ModelList project={project} />}
        {activeTab === "enums" && project && <EnumForm project={project} />}
      </Box>
    </Container>
  );
};

export default ProjectManagementView;
