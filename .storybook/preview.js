import React from "react";
import GlobalThemeProvider from "../src/components/GlobalThemeProvider";
import { Provider } from "react-redux";
import StoryRouter from "storybook-react-router";
import store from "../src/store";
import ThemeWrapper from "../src/components/ThemeWrapper";

export const decorators = [
  StoryRouter(),
  (Story) => (
    <Provider store={store}>
      <ThemeWrapper>
        <GlobalThemeProvider>
          <Story />
        </GlobalThemeProvider>
      </ThemeWrapper>
    </Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
