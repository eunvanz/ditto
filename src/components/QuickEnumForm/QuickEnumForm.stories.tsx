import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import mockProject from "../../mocks/mockProject";
import { FIELD_TYPE } from "../../types";
import QuickEnumForm, { QuickEnumFormProps } from "./QuickEnumForm";

const defaultProps: Partial<QuickEnumFormProps> = {
  isSubmitting: false,
  existingEnumerations: mockProject.enumerations,
};

export default {
  title: "components/QuickEnumForm",
  component: QuickEnumForm,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<QuickEnumFormProps> = (args) => <QuickEnumForm {...args} />;

export const 필드타입_STRING = Template.bind({});
필드타입_STRING.args = {
  fieldType: FIELD_TYPE.STRING,
};

export const 필드타입_INTEGER = Template.bind({});
필드타입_INTEGER.args = {
  fieldType: FIELD_TYPE.INTEGER,
};

export const 기본값있음 = Template.bind({});
기본값있음.args = {
  fieldType: FIELD_TYPE.STRING,
  enumeration: mockProject.enumerations[0],
};
