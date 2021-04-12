import React from "react";
import { Table, TableBody } from "@material-ui/core";
import { Story, Meta } from "@storybook/react/types-6-0";
import mockProject from "../../mocks/mockProject";
import ModelFieldFormItem, { ModelFieldFormItemProps } from "./ModelFieldFormItem";
import mockUser from "../../mocks/mockUser";
import { action } from "@storybook/addon-actions";

const defaultProps: Partial<ModelFieldFormItemProps> = {
  modelFields: mockProject.modelFields,
  projectModels: mockProject.models,
  projectEnumerations: mockProject.enumerations,
  userProfile: mockUser.profile,
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
  onRefreshModelField: action("onRefreshModelField"),
};
