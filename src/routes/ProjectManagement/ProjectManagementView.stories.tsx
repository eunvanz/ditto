import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import mockProject from "../../mocks/mockProject";
import ProjectManagementView, {
  ProjectManagementViewProps,
} from "./ProjectManagementView";

export default {
  title: "views/ProjectManagementView",
  component: ProjectManagementView,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectManagementViewProps> = {
  project: mockProject.project,
};

const Template: Story<ProjectManagementViewProps> = (args) => (
  <ProjectManagementView {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
