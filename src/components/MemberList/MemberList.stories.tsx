import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import MemberList, { MemberListProps } from "./MemberList";
import mockUser from "../../mocks/mockUser";

const defaultProps: Partial<MemberListProps> = {
  members: mockUser.userProfiles,
  hasAuthorization: true,
  title: "Owners",
};

export default {
  title: "components/MemberList",
  component: MemberList,
  argTypes: {},
  args: {
    ...defaultProps,
  },
} as Meta;

const Template: Story<MemberListProps> = (args) => <MemberList {...args} />;

export const 권한있음 = Template.bind({});
권한있음.args = {};
