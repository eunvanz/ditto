import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import InputItems, { InputItemsProps } from "./InputItems";

type PartialProps = Partial<InputItemsProps>;

const defaultProps: PartialProps = {
  label: "Label",
  items: ["item1", "item2", "item3"],
};

export default {
  title: "components/InputItems",
  component: InputItems,
  args: defaultProps,
} as Meta;

const Template: Story<InputItemsProps> = (args) => (
  <InputItems {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
