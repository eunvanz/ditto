import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import RequestBodyFormItem, {
  RequestBodyFormItemProps,
} from "./RequestBodyFormItem";
import { Table, TableBody } from "@material-ui/core";
import mockProject from "../../../mocks/mockProject";

const defaultProps: Partial<RequestBodyFormItemProps> = {
  projectModels: mockProject.models,
  projectEnumerations: mockProject.enumerations,
};

export default {
  title: "components/RequestBodyFormItem",
  component: RequestBodyFormItem,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<RequestBodyFormItemProps> = (args) => (
  <Table>
    <TableBody>
      <RequestBodyFormItem {...args} />
    </TableBody>
  </Table>
);

export const 새로작성 = Template.bind({});
새로작성.args = {
  isNewForm: true,
};

export const 수정 = Template.bind({});
수정.args = {
  requestBody: mockProject.requestBody,
};
