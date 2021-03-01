import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestBodyForm, { RequestBodyFormProps } from "./RequestBodyForm";

const defaultProps: Partial<RequestBodyFormProps> = {
  requestBodies: [],
  checkIsSubmittingRequestBody: () => false,
};

export default {
  title: "components/RequestBodyForm",
  component: RequestBodyForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<RequestBodyFormProps> = (args) => (
  <RequestBodyForm {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
