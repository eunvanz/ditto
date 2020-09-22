import React from "react";
import "./App.css";
import GlobalThemeProvider from "./components/GlobalThemeProvider";
import { Button } from "@material-ui/core";
import StoreProvider from "./components/StoreProvider";

function App() {
  return (
    <StoreProvider>
      <GlobalThemeProvider>
        <Button>test</Button>
      </GlobalThemeProvider>
    </StoreProvider>
  );
}

export default App;
