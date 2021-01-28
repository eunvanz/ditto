import React from "react";
import { Story } from "@storybook/react/types-6-0";
import { Provider } from "react-redux";
import { createStore, RootState } from "../store";

export const withRedux = (state: RootState) => (StoryComponent: Story) => (
  <Provider store={createStore(state)}>
    <StoryComponent />
  </Provider>
);
