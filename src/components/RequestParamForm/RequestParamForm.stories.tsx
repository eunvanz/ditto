import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestParamForm, { RequestParamFormProps } from "./RequestParamForm";
import { withRedux } from "../../helpers/storybookHelpers";
import mockProject from "../../mocks/mockProject";
import { initialRootState } from "../../store";
import { REQUEST_PARAM_LOCATION } from "../../types";

const defaultProps: Partial<RequestParamFormProps> = {
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

export const 헤더 = Template.bind({});
헤더.args = {
  location: REQUEST_PARAM_LOCATION.HEADER,
};
