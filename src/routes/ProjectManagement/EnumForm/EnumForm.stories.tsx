import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import mockProject from "../../../mocks/mockProject";
import EnumForm, { EnumFormProps } from "./EnumForm";

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
