import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelForm, { ModelFormProps } from "./ModelForm";
import mockProject from "../../mocks/mockProject";
import StoreProvider from "../StoreProvider";

export default {
  title: "components/ModelForm",
  component: ModelForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFormProps> = {
  projectModels: mockProject.models,
};

const Template: Story<ModelFormProps> = (args) => (
  <StoreProvider>
    <ModelForm {...defaultProps} {...args} />
  </StoreProvider>
);

export const 아이템있음 = Template.bind({});
아이템있음.args = {
  model: mockProject.model,
  modelFields: mockProject.modelFields,
};

export const 아이템없음 = Template.bind({});
아이템없음.args = {};

export const X버튼없음 = Template.bind({});
X버튼없음.args = {
  onClose: undefined,
};

export const 뎁스있음 = Template.bind({});
뎁스있음.args = {
  model: mockProject.model,
  modelFields: mockProject.modelFields,
  depth: 2,
};
