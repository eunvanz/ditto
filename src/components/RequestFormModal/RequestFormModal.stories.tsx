import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestFormModal, { RequestFormModalProps } from "./RequestFormModal";

const defaultProps: Partial<RequestFormModalProps> = {
  isSubmitting: false,
  isVisible: true,
};

export default {
  title: "components/RequestFormModal",
  component: RequestFormModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<RequestFormModalProps> = (args) => (
  <RequestFormModal {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
