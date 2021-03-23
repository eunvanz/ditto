import React from "react";
import { Switch, Router, Route } from "react-router-dom";
import "./App.css";
import DataInitializer from "./components/DataInitializer/DataInitializer";
import GlobalComponents from "./components/GlobalComponents";
import GlobalProviders from "./components/GlobalProviders";
import history from "./helpers/history";
import DashboardLayout from "./layouts/DashboardLayout";
import ROUTE from "./paths";
import Routes from "./routes";

function RoutedApp() {
  return (
    <Router history={history}>
      <DashboardLayout>
        <Switch>
          <Route
            path={`${ROUTE.PROJECTS}/:projectId${ROUTE.REQUESTS}/:requestId`}
            component={Routes.RequestManagement}
          />
          <Route
            path={`${ROUTE.PROJECTS}/:projectId`}
            component={Routes.ProjectManagement}
          />
          <Route path={`${ROUTE.NOT_FOUND}`} component={Routes.NotFound} />
          <Route path={ROUTE.ROOT} component={Routes.Main} />
          <Route component={Routes.NotFound} />
        </Switch>
      </DashboardLayout>
    </Router>
  );
}

function App() {
  return (
    <GlobalProviders>
      <GlobalComponents />
      <DataInitializer>
        <RoutedApp />
      </DataInitializer>
    </GlobalProviders>
  );
}

export default App;
