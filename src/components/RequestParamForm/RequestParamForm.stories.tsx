import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestParamForm, { RequestParamFormProps } from "./RequestParamForm";
import { withRedux } from "../../helpers/storybookHelpers";
import mockProject from "../../mocks/mockProject";
import { initialRootState } from "../../store";

const defaultProps: Partial<RequestParamFormProps> = {
  title: "Headers",
  checkIsSubmittingRequestParam: () => false,
};

export default {
  title: "components/RequestParamForm",
  component: RequestParamForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
  decorators: [
    withRedux({
      ...initialRootState,
      project: { currentProject: mockProject.project },
    }),
  ],
} as Meta;

const Template: Story<RequestParamFormProps> = (args) => (
  <RequestParamForm {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
