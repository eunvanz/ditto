import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import SignInForm, { SignInFormProps } from "./SignInForm";

export default {
  title: "components/SignInForm",
  component: SignInForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<SignInFormProps> = {};

const Template: Story<SignInFormProps> = (args) => (
  <SignInForm {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
