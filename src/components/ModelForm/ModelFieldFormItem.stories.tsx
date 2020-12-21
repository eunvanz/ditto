import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

import ModelFieldFormItem, {
  ModelFieldFormItemProps,
} from "./ModelFieldFormItem";
import mockProject from "../../mocks/mockProject";

export default {
  title: "components/ModelFieldFormItem",
  component: ModelFieldFormItem,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ModelFieldFormItemProps> = {
  modelFields: mockProject.modelFields,
  // Template에서 주입이 안되어 직접 주입
  onDelete: action("onDelete"),
  onSubmit: action("onSubmit"),
};

const Template: Story<ModelFieldFormItemProps> = (args) => (
  <ModelFieldFormItem {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {
  modelField: mockProject.modelFields[0],
};
