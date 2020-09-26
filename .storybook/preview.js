import React from "react";
import StoryRouter from "storybook-react-router";
import GlobalProviders from "../src/components/GlobalProviders";
import GlobalComponents from "../src/components/GlobalComponents";
import ThemeWrapper from "../src/components/ThemeWrapper";

export const decorators = [
  StoryRouter(),
  (Story) => (
    <GlobalProviders>
      <ThemeWrapper>
        <GlobalComponents />
        <Story />
      </ThemeWrapper>
    </GlobalProviders>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
