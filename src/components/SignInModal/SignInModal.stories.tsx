import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import SignInModal, { SignInModalProps } from "./SignInModal";

export default {
  title: "components/SignInModal",
  component: SignInModal,
  argTypes: {},
} as Meta;

const defaultProps: Partial<SignInModalProps> = {
  isVisible: true,
};

const Template: Story<SignInModalProps> = (args) => (
  <SignInModal {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
