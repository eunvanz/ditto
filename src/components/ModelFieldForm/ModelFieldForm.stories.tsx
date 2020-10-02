import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelFieldForm, { ModelFieldFormProps } from "./ModelFieldForm";
import mockProject from "../../mocks/mockProject";

export default {
  title: "components/ModelFieldForm",
  component: ModelFieldForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFieldFormProps> = {};

const Template: Story<ModelFieldFormProps> = (args) => (
  <ModelFieldForm {...defaultProps} {...args} />
);

export const 아이템있음 = Template.bind({});
아이템있음.args = {
  modelFields: mockProject.modelFields,
};

export const 아이템없음 = Template.bind({});
아이템없음.args = {};
