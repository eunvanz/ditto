import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import MemberList, { MemberListProps } from "./MemberList";
import mockUser from "../../mocks/mockUser";

const defaultProps: Partial<MemberListProps> = {
  members: mockUser.userProfiles,
  title: "Owners",
  userProfile: mockUser.userProfiles[0],
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

export const 오너_롤 = Template.bind({});
오너_롤.args = {
  role: "owner",
};

export const 매니저_롤 = Template.bind({});
매니저_롤.args = {
  role: "manager",
};

export const 게스트_롤 = Template.bind({});
게스트_롤.args = {
  role: "guest",
};
