import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import SignInView, { SignInViewProps } from "./SignInView";

export default {
  title: "views/SignInView",
  component: SignInView,
  argTypes: {},
} as Meta;

const defaultProps: Partial<SignInViewProps> = {};

const Template: Story<SignInViewProps> = (args) => (
  <SignInView {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
