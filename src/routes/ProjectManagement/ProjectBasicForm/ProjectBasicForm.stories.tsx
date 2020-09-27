import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ProjectBasicForm, { ProjectBasicFormProps } from "./ProjectBasicForm";
import mockProject from "../../../mocks/mockProject";

export default {
  title: "components/ProjectBasicForm",
  component: ProjectBasicForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectBasicFormProps> = {
  project: mockProject.project,
};

const Template: Story<ProjectBasicFormProps> = (args) => (
  <ProjectBasicForm {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
