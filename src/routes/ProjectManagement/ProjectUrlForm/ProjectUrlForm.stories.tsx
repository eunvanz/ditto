import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ProjectUrlForm, { ProjectUrlFormProps } from "./ProjectUrlForm";

export default {
  title: "components/ProjectUrlForm",
  component: ProjectUrlForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectUrlFormProps> = {};

const Template: Story<ProjectUrlFormProps> = (args) => (
  <ProjectUrlForm {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
