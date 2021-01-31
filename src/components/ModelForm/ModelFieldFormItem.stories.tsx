import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ModelFieldFormItem, {
  ModelFieldFormItemProps,
} from "./ModelFieldFormItem";
import mockProject from "../../mocks/mockProject";
import { Table, TableBody } from "@material-ui/core";

const defaultProps: Partial<ModelFieldFormItemProps> = {
  modelFields: mockProject.modelFields,
  projectModels: mockProject.models,
};

export default {
  title: "components/ModelFieldFormItem",
  component: ModelFieldFormItem,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<ModelFieldFormItemProps> = (args) => (
  <Table>
    <TableBody>
      <ModelFieldFormItem {...args} />
    </TableBody>
  </Table>
);

export const 기존필드수정 = Template.bind({});
기존필드수정.args = {
  modelField: mockProject.modelFields[0],
};

export const 새필드작성 = Template.bind({});
새필드작성.args = {
  modelField: undefined,
  isFormVisible: true,
};

export const 뎁스 = Template.bind({});
뎁스.args = {
  modelField: mockProject.modelFields[0],
  depth: 2,
};
