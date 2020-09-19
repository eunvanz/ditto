import React from "react";
import "./App.css";
import GlobalThemeProvider from "./components/GlobalThemeProvider";
import { Provider } from "react-redux";
import store from "./store";
import { Button } from "@material-ui/core";

function App() {
  return (
    <Provider store={store}>
      <GlobalThemeProvider>
        <Button>test</Button>
      </GlobalThemeProvider>
    </Provider>
  );
}

export default App;
