import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import MockDataModal, { MockDataModalProps } from "./MockDataModal";
import { THEMES } from "../../types";

const defaultProps: Partial<MockDataModalProps> = {
  theme: THEMES.DARK,
  isVisible: true,
};

export default {
  title: "components/MockDataModal",
  component: MockDataModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<MockDataModalProps> = (args) => <MockDataModal {...args} />;

export const 기본 = Template.bind({});
기본.args = {};
