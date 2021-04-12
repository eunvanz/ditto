import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import CodeModal, { CodeModalProps } from "./CodeModal";
import { THEMES } from "../../types";

type PartialProps = Partial<CodeModalProps>;

const defaultProps: PartialProps = {
  isVisible: true,
  mode: "javascript",
  theme: THEMES.DARK,
  title: "Typescript interface",
  value: `
  export interface ModelFieldItem extends Recordable {
    projectId: string;
    modelId: string;
    fieldName: ModelCell<string>;
    isRequired: ModelCell<boolean>;
    isArray: ModelCell<boolean>;
    fieldType: ModelCell<string>;
    format: ModelCell<string>; // object인 경우 참조하는 모델 id
    enum: ModelCell<string>;
    description: ModelCell<string>;
    settingsByMember: Record<string, BaseSettings>;
    examples?: {
      [FIELD_TYPE.STRING]?: string[];
      [FIELD_TYPE.INTEGER]?: number[];
      [FIELD_TYPE.NUMBER]?: number[];
    };
  }
  `,
};

export default {
  title: "components/CodeModal",
  component: CodeModal,
  args: defaultProps,
} as Meta;

const Template: Story<CodeModalProps> = (args) => (
  <CodeModal {...defaultProps} {...args} />
);

export const 기본 = Template.bind({});
기본.args = {};
