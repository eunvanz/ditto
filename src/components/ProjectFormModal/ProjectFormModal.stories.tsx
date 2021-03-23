import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import ProjectFormModal, { ProjectFormModalProps } from "./ProjectFormModal";

export default {
  title: "components/ProjectFormModal",
  component: ProjectFormModal,
  argTypes: {},
} as Meta;

const defaultProps: Partial<ProjectFormModalProps> = {
  isVisible: true,
};

const Template: Story<ProjectFormModalProps> = (args) => (
  <ProjectFormModal {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
