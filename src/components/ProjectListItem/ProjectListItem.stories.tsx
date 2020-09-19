import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ProjectListItem, { ProjectListItemProps } from "./ProjectListItem";

export default {
  title: "components/ProjectListItem",
  component: ProjectListItem,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectListItemProps> = {
  title: "보험메인개편",
  apiCount: 12,
};

const Template: Story<ProjectListItemProps> = (args) => (
  <ProjectListItem {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
