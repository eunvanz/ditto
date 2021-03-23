import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { withRedux } from "../../helpers/storybookHelpers";
import mockProject from "../../mocks/mockProject";
import { initialRootState } from "../../store";
import { initialProjectState } from "../../store/Project/ProjectSlice";
import QuickEnumFormModal, { QuickEnumFormModalProps } from "./QuickEnumFormModal";

const defaultProps: Partial<QuickEnumFormModalProps> = {
  isVisible: true,
};

export default {
  title: "components/QuickEnumFormModal",
  component: QuickEnumFormModal,
  argTypes: {},
  args: {
    ...defaultProps,
  },
  decorators: [
    withRedux({
      ...initialRootState,
      project: {
        ...initialProjectState,
        currentProject: mockProject.project,
      },
    }),
  ],
} as Meta;

const Template: Story<QuickEnumFormModalProps> = (args) => (
  <QuickEnumFormModal {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
