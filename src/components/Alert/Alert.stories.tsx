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
  title: "로그아웃",
  cancelText: "취소",
  message: "정말 로그아웃 하시겠습니까?",
};

const Template: Story<AlertProps> = (args) => (
  <Alert {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};

export const 컨펌 = Template.bind({});
컨펌.args = {
  cancelText: undefined,
};
