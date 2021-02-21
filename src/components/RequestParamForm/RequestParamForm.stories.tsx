import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestParamForm, { RequestParamFormProps } from "./RequestParamForm";

const defaultProps: Partial<RequestParamFormProps> = {
  title: "Headers",
};

export default {
  title: "components/RequestParamForm",
  component: RequestParamForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<RequestParamFormProps> = (args) => (
  <RequestParamForm {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
