import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import SearchUserForm, { SearchUserFormProps } from "./SearchUserForm";
import mockUser from "../../mocks/mockUser";

type PartialProps = Partial<SearchUserFormProps>;

const defaultProps: PartialProps = {
  resultItems: mockUser.userProfiles,
};

export default {
  title: "components/SearchUserForm",
  component: SearchUserForm,
  args: defaultProps,
} as Meta;

const Template: Story<PartialProps> = (args: PartialProps) => (
  <SearchUserForm {...(defaultProps as SearchUserFormProps)} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
