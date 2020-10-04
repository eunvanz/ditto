import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelForm, { ModelFormProps } from "./ModelForm";

export default {
  title: "components/ModelForm",
  component: ModelForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFormProps> = {};

const Template: Story<ModelFormProps> = (args) => (
  <ModelForm {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
