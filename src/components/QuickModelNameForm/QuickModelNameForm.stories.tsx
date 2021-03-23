import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import QuickModelNameForm, { QuickModelNameFormProps } from "./QuickModelNameForm";

const defaultProps: Partial<QuickModelNameFormProps> = {
  existingModelNames: ["Product", "OrderItem"],
};

export default {
  title: "components/QuickModelNameForm",
  component: QuickModelNameForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<QuickModelNameFormProps> = (args) => (
  <QuickModelNameForm {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};

export const 디폴트값_존재 = Template.bind({});
디폴트값_존재.args = {
  defaultValues: {
    name: "UserInfo",
    description: "사용자 정보",
  },
};

export const 제출중 = Template.bind({});
제출중.args = {
  defaultValues: {
    name: "UserInfo",
    description: "사용자 정보",
  },
  isSubmitting: true,
};
