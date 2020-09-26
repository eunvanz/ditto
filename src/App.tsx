import React from "react";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import { Switch, Router } from "react-router-dom";
import history from "./helpers/history";
import GlobalComponents from "./components/GlobalComponents";
import GlobalProviders from "./components/GlobalProviders";
import DataInitializer from "./components/DataInitializer/DataInitializer";

function App() {
  return (
    <GlobalProviders>
      <DataInitializer>
        <GlobalComponents />
        <Router history={history}>
          <DashboardLayout>
            <Switch></Switch>
          </DashboardLayout>
        </Router>
      </DataInitializer>
    </GlobalProviders>
  );
}

export default App;
