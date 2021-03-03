import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ResponseBodyForm, { ResponseBodyFormProps } from "./ResponseBodyForm";
import mockProject from "../../mocks/mockProject";
import { withRedux } from "../../helpers/storybookHelpers";
import { initialRootState } from "../../store";
import { initialProjectState } from "../../store/Project/ProjectSlice";

const defaultProps: Partial<ResponseBodyFormProps> = {
  responseStatus: mockProject.responseStatus,
};

export default {
  title: "components/ResponseBodyForm",
  component: ResponseBodyForm,
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

const Template: Story<ResponseBodyFormProps> = (args) => (
  <ResponseBodyForm {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
