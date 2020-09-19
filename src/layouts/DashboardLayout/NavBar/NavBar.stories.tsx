import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import FolderOutlined from "@material-ui/icons/FolderOutlined";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";

import NavBar, { NavBarProps } from "./NavBar";
import { REQUEST_METHOD } from "../../../types";

export default {
  title: "components/NavBar",
  component: NavBar,
  argTypes: {},
} as Meta;

const defaultProps: Partial<NavBarProps> = {
  isOpenMobile: true,
  sections: [
    {
      items: [
        {
          icon: EmojiObjectsOutlinedIcon,
          title: "보험프로젝트",
          hasNew: true,
          items: [
            {
              icon: FolderOutlined,
              title: "보험메인",
              hasNew: true,
              items: [
                {
                  title: "내보험 탭 데이터 조회",
                  href: "/projects/insurances/main/1",
                  requestMethod: REQUEST_METHOD.GET,
                },
                {
                  title: "내보험 탭 데이터 조회",
                  href: "/projects/insurances/main/2",
                  requestMethod: REQUEST_METHOD.PUT,
                  hasNew: true,
                },
                {
                  title: "내보험 탭 데이터 조회",
                  href: "/projects/insurances/main/3",
                  requestMethod: REQUEST_METHOD.POST,
                },
                {
                  title: "내보험 탭 데이터 조회",
                  href: "/projects/insurances/main/4",
                  requestMethod: REQUEST_METHOD.DELETE,
                },
                {
                  title: "내보험 탭 데이터 조회",
                  href: "/projects/insurances/main/5",
                  requestMethod: REQUEST_METHOD.PATCH,
                },
              ],
            },
          ],
        },
      ],
      subheader: "내 프로젝트",
    },
  ],
};

const Template: Story<NavBarProps> = (args) => (
  <NavBar {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
