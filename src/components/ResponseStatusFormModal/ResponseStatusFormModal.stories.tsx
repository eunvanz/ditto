import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ResponseStatusFormModal, {
  ResponseStatusFormModalProps,
} from "./ResponseStatusFormModal";

const defaultProps: Partial<ResponseStatusFormModalProps> = {
  isVisible: true,
  existingStatusCodes: [],
};

export default {
  title: "components/ResponseStatusFormModal",
  component: ResponseStatusFormModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<ResponseStatusFormModalProps> = (args) => (
  <ResponseStatusFormModal {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
