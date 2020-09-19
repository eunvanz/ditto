import React from "react";
import GlobalThemeProvider from "../src/components/GlobalThemeProvider";
import { Provider } from "react-redux";
import StoryRouter from "storybook-react-router";
import store from "../src/store";

export const decorators = [
  StoryRouter(),
  (Story) => (
    <Provider store={store}>
      <GlobalThemeProvider>
        <Story />
      </GlobalThemeProvider>
    </Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
