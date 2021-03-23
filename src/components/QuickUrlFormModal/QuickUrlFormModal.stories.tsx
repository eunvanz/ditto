import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import QuickUrlFormModal, { QuickUrlFormModalProps } from "./QuickUrlFormModal";
import mockProject from "../../mocks/mockProject";

const defaultProps: Partial<QuickUrlFormModalProps> = {
  existingUrls: mockProject.projectUrls,
  isSubmitting: false,
  isVisible: true,
};

export default {
  title: "components/QuickUrlFormModal",
  component: QuickUrlFormModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<QuickUrlFormModalProps> = (args) => <QuickUrlFormModal {...args} />;

export const 기본 = Template.bind({});
기본.args = {};
