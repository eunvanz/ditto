import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import CriticalConfirmModal, {
  CriticalConfirmModalProps,
} from "./CriticalConfirmModal";

const defaultProps: Partial<CriticalConfirmModalProps> = {
  title: "프로젝트 삭제",
  isVisible: true,
  keyword: "Kakaopay",
  message:
    "프로젝트 하위의 작업들이 모두 삭제됩니다. 정말 프로젝트를 삭제하시겠습니까? 삭제를 하시려면 {Kakaopay}를 입력해주세요.",
};

export default {
  title: "components/CriticalConfirmModal",
  component: CriticalConfirmModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<CriticalConfirmModalProps> = (args) => (
  <CriticalConfirmModal {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
