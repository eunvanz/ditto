import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelList, { ModelListProps } from "./ModelList";
import mockProject from "../../../mocks/mockProject";

export default {
  title: "components/ModelList",
  component: ModelList,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelListProps> = {
  models: [mockProject.model],
};

const Template: Story<ModelListProps> = (args) => (
  <ModelList {...defaultProps} {...args} />
);

export const 목록있음 = Template.bind({});
목록있음.args = {};

export const 목록없음 = Template.bind({});
목록없음.args = {
  models: [],
};
