import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import TopBar, { TopBarProps } from "./TopBar";

export default {
  title: "components/TopBar",
  component: TopBar,
  argTypes: {},
} as Meta;

const defaultProps: Partial<TopBarProps> = {};

const Template: Story<TopBarProps> = (args) => (
  <TopBar {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
