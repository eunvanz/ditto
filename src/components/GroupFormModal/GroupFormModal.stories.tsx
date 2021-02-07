import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import GroupForm, { GroupFormModalProps } from "./GroupFormModal";

const defaultProps: Partial<GroupFormModalProps> = {
  isSubmitting: false,
  isVisible: true,
  existingGroupNames: ["존재하는그룹", "있는그룹"],
};

export default {
  title: "components/GroupForm",
  component: GroupForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<GroupFormModalProps> = (args) => <GroupForm {...args} />;

export const 생성 = Template.bind({});
생성.args = {};

export const 수정 = Template.bind({});
수정.args = {
  defaultValues: {
    name: "그룹이름",
  },
};
