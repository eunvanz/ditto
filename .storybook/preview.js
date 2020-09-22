import React from "react";
import GlobalThemeProvider from "../src/components/GlobalThemeProvider";
import StoryRouter from "storybook-react-router";
import ThemeWrapper from "../src/components/ThemeWrapper";
import StoreProvider from "../src/components/StoreProvider";

export const decorators = [
  StoryRouter(),
  (Story) => (
    <StoreProvider>
      <ThemeWrapper>
        <GlobalThemeProvider>
          <Story />
        </GlobalThemeProvider>
      </ThemeWrapper>
    </StoreProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
