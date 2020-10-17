import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelForm, { ModelFormProps } from "./ModelForm";
import mockProject from "../../mocks/mockProject";

export default {
  title: "components/ModelForm",
  component: ModelForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFormProps> = {};

const Template: Story<ModelFormProps> = (args) => (
  <ModelForm {...defaultProps} {...args} />
);

export const 아이템있음 = Template.bind({});
아이템있음.args = {
  model: mockProject.model,
};

export const 아이템없음 = Template.bind({});
아이템없음.args = {};
