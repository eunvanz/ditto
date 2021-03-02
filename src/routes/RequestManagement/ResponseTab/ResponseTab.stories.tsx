import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ResponseTab, { ResponseTabProps } from "./ResponseTab";

const defaultProps: Partial<ResponseTabProps> = {};

export default {
  title: "components/ResponseTab",
  component: ResponseTab,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<ResponseTabProps> = (args) => <ResponseTab {...args} />;

export const 기본 = Template.bind({});
기본.args = {};
