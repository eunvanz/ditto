import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import TopBar, { TopBarProps } from "./TopBar";
import { withRedux } from "../../../helpers/storybookHelpers";
import mockUser from "../../../mocks/mockUser";
import { initialRootState } from "../../../store";
import { initialFirebaseState } from "../../../store/Firebase";

export default {
  title: "components/TopBar",
  component: TopBar,
  argTypes: {},
  decorators: [
    withRedux({
      ...initialRootState,
      firebase: {
        ...initialFirebaseState,
        auth: mockUser.auth,
        profile: mockUser.profile,
      },
      firestore: {
        ordered: {
          notifications: mockUser.notifications,
        },
      },
    }),
  ],
} as Meta;

const defaultProps: Partial<TopBarProps> = {};

const Template: Story<TopBarProps> = (args) => (
  <TopBar {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
