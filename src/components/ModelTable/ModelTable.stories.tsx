import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelTable, { ModelTableProps } from "./ModelTable";
import mockProject from "../../mocks/mockProject";

const defaultProps: Partial<ModelTableProps> = {
  modelFields: mockProject.modelFields,
  projectModels: mockProject.models,
  projectEnumerations: mockProject.enumerations,
  checkIsSubmittingModelField: () => false,
};

export default {
  title: "components/ModelTable",
  component: ModelTable,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<ModelTableProps> = (args) => <ModelTable {...args} />;

export const 아이템있음 = Template.bind({});
아이템있음.args = {};
