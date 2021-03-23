import React from "react";
import { action } from "@storybook/addon-actions";
import { Story, Meta } from "@storybook/react/types-6-0";
import mockProject from "../../../mocks/mockProject";
import SettingsTab, { SettingsTabProps } from "./SettingsTab";

const defaultProps: Partial<SettingsTabProps> = {
  projectGroups: mockProject.groups,
  request: mockProject.request,
  requests: [mockProject.request],
  onSubmit: action("onSubmit"),
};

export default {
  title: "components/SettingsTab",
  component: SettingsTab,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<SettingsTabProps> = (args) => <SettingsTab {...args} />;

export const 기본 = Template.bind({});
기본.args = {};
