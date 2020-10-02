import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelFieldForm, { ModelFieldFormProps } from "./ModelFieldForm";

export default {
  title: "components/ModelFieldForm",
  component: ModelFieldForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFieldFormProps> = {};

const Template: Story<ModelFieldFormProps> = (args) => (
  <ModelFieldForm {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
