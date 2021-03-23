import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import Alert, { AlertProps } from "./Alert";

export default {
  title: "components/Alert",
  component: Alert,
  argTypes: {},
} as Meta;

const defaultProps: Partial<AlertProps> = {
  isVisible: true,
  title: "Sign out",
  cancelText: "Cancel",
  message: "Are you sure to sign out?",
};

const Template: Story<AlertProps> = (args) => <Alert {...defaultProps} {...args} />;

export const 기본 = Template.bind({});
기본.args = {};

export const 컨펌 = Template.bind({});
컨펌.args = {
  cancelText: undefined,
};
