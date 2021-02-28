import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import GroupFormModal, { GroupFormModalProps } from "./GroupFormModal";

const defaultProps: Partial<GroupFormModalProps> = {
  isSubmitting: false,
  isVisible: true,
  existingGroupNames: ["존재하는Group", "있는Group"],
};

export default {
  title: "components/GroupFormModal",
  component: GroupFormModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<GroupFormModalProps> = (args) => (
  <GroupFormModal {...args} />
);

export const 생성 = Template.bind({});
생성.args = {};

export const 수정 = Template.bind({});
수정.args = {
  defaultValues: {
    name: "Group Name",
  },
};
