import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ProjectUrlForm, { ProjectUrlFormProps } from "./ProjectUrlForm";
import mockProject from "../../../mocks/mockProject";

export default {
  title: "components/ProjectUrlForm",
  component: ProjectUrlForm,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectUrlFormProps> = {
  projectUrls: mockProject.projectUrls,
};

const Template: Story<ProjectUrlFormProps> = (args) => (
  <ProjectUrlForm {...defaultProps} {...args} />
);

export const 아이템있음 = Template.bind({});
아이템있음.args = {};

export const 아이템없음 = Template.bind({});
아이템없음.args = {
  projectUrls: [],
};
