import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import Account, { AccountProps } from "./Account";
import mockUser from "../../../../mocks/mockUser";

export default {
  title: "components/Account",
  component: Account,
  argTypes: {},
} as Meta;

const defaultProps: Partial<AccountProps> = {
  user: mockUser.user,
};

const Template: Story<AccountProps> = (args) => <Account {...defaultProps} {...args} />;

export const 로그온 = Template.bind({});
로그온.args = {};

export const 로그아웃 = Template.bind({});
로그아웃.args = {
  user: undefined,
};
