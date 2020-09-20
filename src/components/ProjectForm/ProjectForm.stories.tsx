import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ProjectForm, { ProjectFormProps } from "./ProjectForm";

export default {
  title: "components/ProjectForm",
  component: ProjectForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectFormProps> = {};

const Template: Story<ProjectFormProps> = (args) => (
  <ProjectForm {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
