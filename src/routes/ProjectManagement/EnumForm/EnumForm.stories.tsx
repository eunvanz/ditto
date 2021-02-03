import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import EnumForm, { EnumFormProps } from "./EnumForm";
import mockProject from "../../../mocks/mockProject";

const defaultProps: Partial<EnumFormProps> = {
  enumerations: mockProject.enumerations,
};

export default {
  title: "components/EnumForm",
  component: EnumForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<EnumFormProps> = (args) => <EnumForm {...args} />;

export const 기본 = Template.bind({});
기본.args = {};
