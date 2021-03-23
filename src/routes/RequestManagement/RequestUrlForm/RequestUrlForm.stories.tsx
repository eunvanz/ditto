import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestUrlForm, { RequestUrlFormProps } from "./RequestUrlForm";
import mockProject from "../../../mocks/mockProject";
import { withRedux } from "../../../helpers/storybookHelpers";
import { initialRootState } from "../../../store";

const defaultProps: Partial<RequestUrlFormProps> = {
  baseUrls: mockProject.projectUrls,
  request: mockProject.request,
};

export default {
  title: "components/RequestUrlForm",
  component: RequestUrlForm,
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

const Template: Story<RequestUrlFormProps> = (args) => <RequestUrlForm {...args} />;

export const 기본 = Template.bind({});
기본.args = {};
