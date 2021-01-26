import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import QuickModelNameFormModal, {
  QuickModelNameFormModalProps,
} from "./QuickModelNameFormModal";

const defaultProps: Partial<QuickModelNameFormModalProps> = {
  isVisible: true,
};

export default {
  title: "components/QuickModelNameFormModal",
  component: QuickModelNameFormModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<QuickModelNameFormModalProps> = (args) => (
  <QuickModelNameFormModal {...args} />
);

export const 새로운_모델 = Template.bind({});
새로운_모델.args = {
  isModification: false,
};

export const 모델_수정 = Template.bind({});
모델_수정.args = {
  isModification: true,
};
