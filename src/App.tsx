import React from "react";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import { Switch, Router, Route } from "react-router-dom";
import history from "./helpers/history";
import GlobalComponents from "./components/GlobalComponents";
import GlobalProviders from "./components/GlobalProviders";
import DataInitializer from "./components/DataInitializer/DataInitializer";
import ROUTE from "./paths";
import Routes from "./routes";

function RoutedApp() {
  return (
    <Router history={history}>
      <DashboardLayout>
        <Switch>
          <Route
            path={`${ROUTE.PROJECTS}/:projectId`}
            component={Routes.ProjectManagement}
          />
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
