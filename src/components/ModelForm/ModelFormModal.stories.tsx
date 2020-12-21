import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { ModelFormModal, ModelFormModalProps } from "./ModelForm";
import mockProject from "../../mocks/mockProject";

export default {
  title: "components/ModelFormModal",
  component: ModelFormModal,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFormModalProps> = {
  isVisible: true,
  existingModelNames: [],
};

const Template: Story<ModelFormModalProps> = (args) => (
  <ModelFormModal {...defaultProps} {...args} />
);

export const 아이템없음 = Template.bind({});
아이템없음.args = {};

export const 아이템있음 = Template.bind({});
아이템있음.args = {
  model: mockProject.model,
};
